"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { type CharacterWithId } from "@/hooks/use-characters"
import { formatDistanceToNow } from "date-fns"

interface CharacterViewerProps {
  character: CharacterWithId
}

export function CharacterViewer({ character }: CharacterViewerProps) {
  const getAbilityScoreModifier = (score: number) => {
    const modifier = Math.floor((score - 10) / 2)
    return modifier >= 0 ? `+${modifier}` : `${modifier}`
  }

  const getCharacterSummary = () => {
    const classes = character.classes?.map(c => `${c.class} ${c.level}`).join(" / ") || "No Class"
    const race = character.race || "No Race"
    const level = character.level || 1
    
    return {
      classes,
      race,
      level
    }
  }

  const summary = getCharacterSummary()

  return (
    <div className="space-y-6">
      {/* Character Header */}
      <Card className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="font-display text-2xl mb-2">
                {character.name || "Unnamed Character"}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{summary.race}</span>
                <span>•</span>
                <span>{summary.classes}</span>
                <span>•</span>
                <span>Level {summary.level}</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              <div>Created {formatDistanceToNow(character.createdAt, { addSuffix: true })}</div>
              <div>Updated {formatDistanceToNow(character.updatedAt, { addSuffix: true })}</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Narrative Section */}
      <Card className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-display text-lg">Narrative</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {character.background && (
            <div>
              <h4 className="font-semibold mb-2">Background</h4>
              <p className="text-sm">{character.background}</p>
            </div>
          )}

          {character.alignment && (
            <div>
              <h4 className="font-semibold mb-2">Alignment</h4>
              <Badge variant="outline" className="border-amber-800/30">
                {character.alignment}
              </Badge>
            </div>
          )}

          {character.appearance && (
            <div>
              <h4 className="font-semibold mb-2">Appearance</h4>
              <p className="text-sm">{character.appearance}</p>
            </div>
          )}

          {character.backstory && (
            <div>
              <h4 className="font-semibold mb-2">Backstory</h4>
              <p className="text-sm">{character.backstory}</p>
            </div>
          )}

          {character.personalityTraits && (
            <div>
              <h4 className="font-semibold mb-2">Personality Traits</h4>
              <p className="text-sm">{character.personalityTraits}</p>
            </div>
          )}

          {character.ideals && (
            <div>
              <h4 className="font-semibold mb-2">Ideals</h4>
              <p className="text-sm">{character.ideals}</p>
            </div>
          )}

          {character.bonds && (
            <div>
              <h4 className="font-semibold mb-2">Bonds</h4>
              <p className="text-sm">{character.bonds}</p>
            </div>
          )}

          {character.flaws && (
            <div>
              <h4 className="font-semibold mb-2">Flaws</h4>
              <p className="text-sm">{character.flaws}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mechanics Section */}
      <Card className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-display text-lg">Mechanics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Ability Scores */}
          {character.abilityScores && (
            <div>
              <h4 className="font-semibold mb-3">Ability Scores</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(character.abilityScores).map(([ability, score]) => (
                  <div key={ability} className="flex items-center justify-between p-2 border border-amber-800/30 rounded">
                    <span className="font-medium capitalize">{ability}</span>
                    <div className="text-right">
                      <div className="font-bold">{score}</div>
                      <div className="text-xs text-muted-foreground">
                        {getAbilityScoreModifier(score)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator className="bg-amber-800/30" />

          {/* Skills */}
          {character.skills && character.skills.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {character.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="border-amber-800/30">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tools */}
          {character.tools && character.tools.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Tools</h4>
              <div className="flex flex-wrap gap-2">
                {character.tools.map((tool) => (
                  <Badge key={tool} variant="outline" className="border-amber-800/30">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {character.languages && character.languages.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Languages</h4>
              <div className="flex flex-wrap gap-2">
                {character.languages.map((language) => (
                  <Badge key={language} variant="outline" className="border-amber-800/30">
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Feats */}
          {character.feats && character.feats.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Feats</h4>
              <div className="flex flex-wrap gap-2">
                {character.feats.map((feat) => (
                  <Badge key={feat} variant="outline" className="border-green-600/50 bg-green-900/20 text-green-300">
                    {feat}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Wealth */}
          {character.wealth && (
            <div>
              <h4 className="font-semibold mb-2">Wealth</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="flex items-center justify-between p-2 border border-purple-800/30 rounded">
                  <span className="text-purple-300">Platinum</span>
                  <span className="font-bold">{character.wealth.platinum}</span>
                </div>
                <div className="flex items-center justify-between p-2 border border-yellow-800/30 rounded">
                  <span className="text-yellow-300">Gold</span>
                  <span className="font-bold">{character.wealth.gold}</span>
                </div>
                <div className="flex items-center justify-between p-2 border border-gray-800/30 rounded">
                  <span className="text-gray-300">Silver</span>
                  <span className="font-bold">{character.wealth.silver}</span>
                </div>
                <div className="flex items-center justify-between p-2 border border-orange-800/30 rounded">
                  <span className="text-orange-300">Copper</span>
                  <span className="font-bold">{character.wealth.bronze}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progression Section */}
      {character.levelProgression && character.levelProgression.length > 0 && (
        <Card className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-display text-lg">Progression</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {character.levelProgression.map((entry, index) => (
                <div key={index} className="border border-amber-800/30 rounded p-3">
                  <h4 className="font-semibold mb-2">Level {entry.level}</h4>
                  {entry.featuresGained && (
                    <div className="mb-2">
                      <span className="text-sm font-medium">Features: </span>
                      <span className="text-sm">{entry.featuresGained}</span>
                    </div>
                  )}
                  {entry.spellsLearned && (
                    <div className="mb-2">
                      <span className="text-sm font-medium">Spells: </span>
                      <span className="text-sm">{entry.spellsLearned}</span>
                    </div>
                  )}
                  {entry.equipmentChanges && (
                    <div className="mb-2">
                      <span className="text-sm font-medium">Equipment: </span>
                      <span className="text-sm">{entry.equipmentChanges}</span>
                    </div>
                  )}
                  {entry.notes && (
                    <div>
                      <span className="text-sm font-medium">Notes: </span>
                      <span className="text-sm">{entry.notes}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 