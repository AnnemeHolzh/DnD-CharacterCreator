const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get } = require('firebase/database');
const XLSX = require('xlsx');
const path = require('path');

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCpCu3kOoUJC_JSR3QbuYNtba-4GjUnNvc',
  authDomain: 'dndcharactercollector.firebaseapp.com',
  databaseURL: 'https://dndcharactercollector-default-rtdb.firebaseio.com',
  projectId: 'dndcharactercollector',
  storageBucket: 'dndcharactercollector.firebasestorage.app',
  messagingSenderId: '545639440265',
  appId: '1:545639440265:web:5dc203731c5d900e5c0b58'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to format classes for better readability
function formatClasses(classes) {
  if (!classes || !Array.isArray(classes)) return '';
  
  return classes.map(cls => {
    const parts = [];
    if (cls.class) parts.push(cls.class);
    if (cls.subclass) parts.push(`(${cls.subclass})`);
    if (cls.level) parts.push(`Level ${cls.level}`);
    return parts.join(' ');
  }).join(' | ');
}

// Function to format ASI choices for better readability
function formatASIChoices(asiChoices) {
  if (!asiChoices || !Array.isArray(asiChoices)) return '';
  
  return asiChoices.map(choice => {
    const parts = [];
    if (choice.choice) parts.push(choice.choice);
    if (choice.abilities && Array.isArray(choice.abilities)) {
      parts.push(`[${choice.abilities.join(', ')}]`);
    }
    return parts.join(' ');
  }).join(' | ');
}

// Function to format level progression
function formatLevelProgression(levelProgression) {
  if (!levelProgression || !Array.isArray(levelProgression)) return '';
  
  return levelProgression.map(prog => {
    const parts = [];
    if (prog.level) parts.push(`Level ${prog.level}`);
    if (prog.featuresGained) parts.push(`Features: ${prog.featuresGained}`);
    if (prog.spellsLearned) parts.push(`Spells: ${prog.spellsLearned}`);
    if (prog.equipmentChanges) parts.push(`Equipment: ${prog.equipmentChanges}`);
    if (prog.notes) parts.push(`Notes: ${prog.notes}`);
    return parts.join(' | ');
  }).join('\n');
}

// Function to flatten nested objects for Excel export
function flattenObject(obj, prefix = '') {
  const flattened = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}_${key}` : key;
      
      // Handle special cases first
      if (key === 'classes') {
        flattened[newKey] = formatClasses(obj[key]);
      } else if (key === 'asiChoices') {
        flattened[newKey] = formatASIChoices(obj[key]);
      } else if (key === 'levelProgression') {
        flattened[newKey] = formatLevelProgression(obj[key]);
      } else if (key === 'calculatedStats') {
        // Handle calculated stats specially
        if (obj[key] && typeof obj[key] === 'object') {
          if (obj[key].hpBreakdown && Array.isArray(obj[key].hpBreakdown)) {
            flattened[`${newKey}_hpBreakdown`] = obj[key].hpBreakdown.join(' | ');
          }
          if (obj[key].acBreakdown && Array.isArray(obj[key].acBreakdown)) {
            flattened[`${newKey}_acBreakdown`] = obj[key].acBreakdown.join(' | ');
          }
          if (obj[key].initiativeBreakdown && Array.isArray(obj[key].initiativeBreakdown)) {
            flattened[`${newKey}_initiativeBreakdown`] = obj[key].initiativeBreakdown.join(' | ');
          }
          // Keep the numeric values
          if (typeof obj[key].hp === 'number') flattened[`${newKey}_hp`] = obj[key].hp;
          if (typeof obj[key].ac === 'number') flattened[`${newKey}_ac`] = obj[key].ac;
          if (typeof obj[key].initiative === 'number') flattened[`${newKey}_initiative`] = obj[key].initiative;
        }
      } else if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        // Recursively flatten nested objects
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else if (Array.isArray(obj[key])) {
        // Convert arrays to pipe-separated strings for better readability
        flattened[newKey] = obj[key].join(' | ');
      } else {
        // Handle primitive values
        flattened[newKey] = obj[key];
      }
    }
  }
  
  return flattened;
}

// Function to format dates
function formatDate(timestamp) {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleString();
}

// Main function to export characters to Excel
async function exportCharactersToExcel() {
  try {
    console.log('Starting character export...');
    
    // Get all characters from Firebase
    const charactersRef = ref(database, 'characters');
    const snapshot = await get(charactersRef);
    
    if (!snapshot.exists()) {
      console.log('No characters found in database');
      return;
    }
    
    const characters = [];
    snapshot.forEach((childSnapshot) => {
      const characterId = childSnapshot.key;
      
      // Filter out characters whose ID starts with 'TSV'
      if (!characterId.startsWith('TSV')) {
        const characterData = childSnapshot.val();
        characters.push({
          id: characterId,
          ...characterData
        });
      }
    });
    
    console.log(`Found ${characters.length} characters (excluding TSV characters)`);
    
    if (characters.length === 0) {
      console.log('No characters to export after filtering');
      return;
    }
    
    // Prepare data for Excel export
    const excelData = characters.map(character => {
      const flattened = flattenObject(character);
      
      // Format specific fields for better readability
      const formatted = {
        id: flattened.id || '',
        name: flattened.name || '',
        race: flattened.race || '',
        subrace: flattened.subrace || '',
        background: flattened.background || '',
        alignment: flattened.alignment || '',
        level: flattened.level || '',
        classes: flattened.classes || '',
        // Format ability scores
        abilityScores_strength: flattened.abilityScores_strength || '',
        abilityScores_dexterity: flattened.abilityScores_dexterity || '',
        abilityScores_constitution: flattened.abilityScores_constitution || '',
        abilityScores_intelligence: flattened.abilityScores_intelligence || '',
        abilityScores_wisdom: flattened.abilityScores_wisdom || '',
        abilityScores_charisma: flattened.abilityScores_charisma || '',
        // Format wealth
        wealth_platinum: flattened.wealth_platinum || 0,
        wealth_gold: flattened.wealth_gold || 0,
        wealth_silver: flattened.wealth_silver || 0,
        wealth_bronze: flattened.wealth_bronze || 0,
        // Format calculated stats
        calculatedStats_hp: flattened.calculatedStats_hp || '',
        calculatedStats_ac: flattened.calculatedStats_ac || '',
        calculatedStats_initiative: flattened.calculatedStats_initiative || '',
        // Format other important fields
        hp: flattened.hp || '',
        xp: flattened.xp || '',
        skills: flattened.skills || '',
        tools: flattened.tools || '',
        languages: flattened.languages || '',
        weapons: flattened.weapons || '',
        armor: flattened.armor || '',
        shield: flattened.shield || '',
        items: flattened.items || '',
        spells: flattened.spells || '',
        feats: flattened.feats || '',
        asiChoices: flattened.asiChoices || '',
        // Narrative fields
        appearance: flattened.appearance || '',
        backstory: flattened.backstory || '',
        personalityTraits: flattened.personalityTraits || '',
        ideals: flattened.ideals || '',
        bonds: flattened.bonds || '',
        flaws: flattened.flaws || '',
        // Metadata
        createdAt: formatDate(flattened.createdAt),
        updatedAt: formatDate(flattened.updatedAt),
      };
      
      return formatted;
    });
    
    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths for better readability - dynamically based on actual data
    const columnWidths = {};
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    
    // Set default column widths
    for (let col = range.s.c; col <= range.e.c; col++) {
      const colLetter = XLSX.utils.encode_col(col);
      const header = worksheet[`${colLetter}1`];
      
      if (header && header.v) {
        const headerText = header.v.toString();
        
        // Set specific widths for important columns
        if (headerText.includes('classes') || headerText.includes('asiChoices') || headerText.includes('levelProgression')) {
          columnWidths[col] = { wch: 40 };
        } else if (headerText.includes('backstory') || headerText.includes('appearance')) {
          columnWidths[col] = { wch: 60 };
        } else if (headerText.includes('personalityTraits') || headerText.includes('ideals') || headerText.includes('bonds') || headerText.includes('flaws')) {
          columnWidths[col] = { wch: 35 };
        } else if (headerText.includes('skills') || headerText.includes('tools') || headerText.includes('languages') || headerText.includes('weapons') || headerText.includes('spells') || headerText.includes('feats') || headerText.includes('items')) {
          columnWidths[col] = { wch: 30 };
        } else if (headerText.includes('id')) {
          columnWidths[col] = { wch: 25 };
        } else if (headerText.includes('name') || headerText.includes('background')) {
          columnWidths[col] = { wch: 25 };
        } else if (headerText.includes('race') || headerText.includes('subrace') || headerText.includes('alignment')) {
          columnWidths[col] = { wch: 15 };
        } else if (headerText.includes('level') || headerText.includes('hp') || headerText.includes('ac') || headerText.includes('initiative')) {
          columnWidths[col] = { wch: 10 };
        } else if (headerText.includes('abilityScores')) {
          columnWidths[col] = { wch: 12 };
        } else if (headerText.includes('wealth')) {
          columnWidths[col] = { wch: 8 };
        } else {
          columnWidths[col] = { wch: 15 };
        }
      }
    }
    
    worksheet['!cols'] = columnWidths;
    
    // Enable text wrapping for better readability
    const cellRange = XLSX.utils.decode_range(worksheet['!ref']);
    for (let row = 1; row <= cellRange.e.r; row++) {
      for (let col = cellRange.s.c; col <= cellRange.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!worksheet[cellAddress]) continue;
        
        // Set text wrapping for cells with longer content
        if (!worksheet[cellAddress].s) worksheet[cellAddress].s = {};
        worksheet[cellAddress].s.alignment = { wrapText: true, vertical: 'top' };
        
        // Set borders for better readability
        if (!worksheet[cellAddress].s.border) {
          worksheet[cellAddress].s.border = {
            top: { style: 'thin', color: { rgb: 'CCCCCC' } },
            bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
            left: { style: 'thin', color: { rgb: 'CCCCCC' } },
            right: { style: 'thin', color: { rgb: 'CCCCCC' } }
          };
        }
      }
    }
    
    // Style the header row
    for (let col = cellRange.s.c; col <= cellRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (worksheet[cellAddress]) {
        if (!worksheet[cellAddress].s) worksheet[cellAddress].s = {};
        worksheet[cellAddress].s.fill = { fgColor: { rgb: 'F0F0F0' } };
        worksheet[cellAddress].s.font = { bold: true };
        worksheet[cellAddress].s.alignment = { wrapText: true, horizontal: 'center', vertical: 'center' };
      }
    }
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Characters');
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `characters_export_${timestamp}.xlsx`;
    const filepath = path.join(__dirname, filename);
    
    // Write file
    XLSX.writeFile(workbook, filepath);
    
    console.log(`✅ Successfully exported ${characters.length} characters to ${filename}`);
    console.log(`📁 File saved to: ${filepath}`);
    
    // Display summary statistics
    const stats = {
      totalCharacters: characters.length,
      charactersWithNames: characters.filter(c => c.name && c.name.trim()).length,
      charactersWithRaces: characters.filter(c => c.race).length,
      charactersWithClasses: characters.filter(c => c.classes && c.classes.length > 0).length,
      charactersWithAbilityScores: characters.filter(c => c.abilityScores && Object.values(c.abilityScores).some(score => score > 0)).length,
      charactersWithBackstories: characters.filter(c => c.backstory && c.backstory.trim()).length,
    };
    
    console.log('\n📊 Export Summary:');
    console.log(`Total Characters: ${stats.totalCharacters}`);
    console.log(`Characters with Names: ${stats.charactersWithNames}`);
    console.log(`Characters with Races: ${stats.charactersWithRaces}`);
    console.log(`Characters with Classes: ${stats.charactersWithClasses}`);
    console.log(`Characters with Ability Scores: ${stats.charactersWithAbilityScores}`);
    console.log(`Characters with Backstories: ${stats.charactersWithBackstories}`);
    
  } catch (error) {
    console.error('❌ Error exporting characters:', error);
    process.exit(1);
  }
}

// Run the export
exportCharactersToExcel()
  .then(() => {
    console.log('\n🎉 Export completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Export failed:', error);
    process.exit(1);
  });
