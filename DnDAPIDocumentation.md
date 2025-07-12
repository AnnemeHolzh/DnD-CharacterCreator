# 📚 5e‑bits API Guide for Tools & Equipment UI

## Overview

The 5e‑bits API (aka dnd5eapi.co) is an open-source REST+GraphQL API exposing the SRD portion of the D&D 5e rule set. It's organized into resources collections accessible via endpoints like `/equipment`, `/spells`, `/tools`, etc. Each endpoint provides:

- A list endpoint returning summary info (index, name, url)
- A detail endpoint for full object data
- GraphQL access for flexible multi-entity queries

## API Structure & Endpoints

### Core Endpoints

#### `/equipment`
- `GET /api/2014/equipment` → list of equipment items (index, name, url)
- `GET /api/2014/equipment/{index}` → detail including category, cost, weight, equipment properties

#### `/equipment-categories`
- `GET /api/2014/equipment-categories` → list makeup of categories
- `GET /api/2014/equipment-categories/{index}` → detail: lists equipment URLs belonging to that category

#### `/weapon-properties`
- `GET /api/2014/weapon-properties` → list of weapon property descriptors
- `GET /api/2014/weapon-properties/{index}` → description, short form, etc.

#### `/magic-items`
- `GET /api/2014/magic-items` → list of SRD items
- `GET /api/2014/magic-items/{index}` → detailed stats, rarity, attunement

#### `/spells`
- `GET /api/2014/spells` → list of spells with basic metadata
  - Supports filtering: e.g., `?level=1` or `?school=evocation` (REST only for spells & monsters)
- `GET /api/2014/spells/{index}` → full spell details

#### `/tools`
- `GET /api/2014/tools` → list
- `GET /api/2014/tools/{index}` → description, required proficiency

#### `/armor` & `/weapons`
These are subtypes of `/equipment`.

- `/equipment` items have `"equipment_category": "Armor"` or `"Weapon"`

For focused queries:

- `GET /api/2014/equipment-categories/armor` → returns all armor
- `GET /api/2014/equipment-categories/weapon` → returns all weapons

## How to Use From Frontend

### When populating selectors:

#### Fetch List

```javascript
const res = await fetch('https://www.dnd5eapi.co/api/2014/equipment-categories/armor');
const data = await res.json();
// data.equipment ∙ [{ index, name, url }]
```

#### Optional Filter
Use `/spells?level=1` to retrieve only level‑1 spells.

#### Detail On‑Demand
Upon user selection fetch `/equipment/{index}` to load weight, cost, properties.

### Structure for Toolkits

- Query `/tools`, group by their `"tool_category"` field.
- Categorize under sections like "Stealth Tools" vs. "Artisan's Tools."

### Example Usage

```javascript
// Populate Weapon Selector
async function loadWeapons() {
  const cat = await fetch('/api/2014/equipment-categories/weapon').then(r=>r.json());
  return cat.equipment.map(e => ({ value: e.index, label: e.name }));
}

// On selection, get details:
async function getWeaponDetail(index) {
  const item = await fetch(`/api/2014/equipment/${index}`).then(r=>r.json());
  return {
    name: item.name,
    damage: item.damage?.damage_dice,
    properties: item.properties.map(p=>p.name),
    weight: item.weight,
  };
}
```

## Notes & Limitations

- Filtering only works on `/spells` and `/monsters` endpoints. Other collections must be filtered client-side.
- All endpoints list summary; full records require detail fetch.
- CORS is enabled — safe for browser fetches.
- Supports pagination, but for SRD size you'll usually get all items in one fetch.
- GraphQL allows combining list + detail in one call — e.g. fetch armor and average cost.

### GraphQL Tip

```graphql
query PickArmor {
  equipment(where: { equipment_category: "Armor" }) {
    results {
      index
      name
      armor_class { value }
      weight
      cost { quantity unit }
    }
  }
}
```

This gives all armor in a single request.

## Populating UI Selectors

| Selector | Endpoint | Grouping Strategy |
|----------|----------|-------------------|
| Armor | `/equipment-categories/armor` | By armor class: light/medium/heavy |
| Weapons | `/equipment-categories/weapon` | By property: finesse, heavy, etc. |
| Tools/Toolkits | `/tools` + client group by tool_category | By artisan, gaming, musical |
| Equipment | `/equipment` - full list | Client can filter by gear tags |
| Magic Items | `/magic-items` → full list | Group by rarity or attunement |
| Spells | `/spells?level=X` | Hierarchy: by spell level & school |

## Code Snippets & Examples

### Fetch & Render Armor

```html
<select id="armor-select"></select>
<script>
async function renderArmorOptions() {
  const cat = await fetch('/api/2014/equipment-categories/armor').then(r=>r.json());
  const select = document.getElementById('armor-select');
  cat.equipment.forEach(a => {
    const opt = document.createElement('option');
    opt.value = a.index;
    opt.text = a.name;
    select.add(opt);
  });
}
renderArmorOptions();
</script>
```

### Fetch Armor Detail

```javascript
select.addEventListener('change', async () => {
  const detail = await fetch(`/api/2014/equipment/${select.value}`).then(r=>r.json());
  displayStats({
    ac: detail.armor_class.base,
    strReq: detail.str_minimum,
    stealthDis: detail.stealth_disadvantage
  });
});
```

## Bonus: Helper Libraries

- **dnd5e-api** for Go – not JS
- **awesome-5e-srd** – lists tools, clients, bots

For JS/TS: consider using OpenAPI generator from their spec (bundled with docs repo)

GraphQL wrapper via apollo-client offers rich query flexibility.

## Summary

- REST is straightforward: list via category, fetch detail per selection.
- GraphQL offers powerful multi-resource fetches.
- Use `/equipment-categories` and `/tools` for UI grouping.
- Simple fetch + map code is enough for modern frontends.
- OpenAPI spec and client libraries streamline plumbing.

Let me know if you'd like GraphQL schema examples or React/TypeScript components built out