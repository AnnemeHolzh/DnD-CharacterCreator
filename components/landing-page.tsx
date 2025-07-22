"use client"

import { Button } from "@/components/ui/button"
import { FantasyCard } from "@/components/ui/fantasy-card"
import { Sparkles, User, Scroll, Swords, BookOpen, Dice6, Shield, Wand2 } from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import FancyButton from "@/components/FancyButton"
import { useEffect } from "react"
import PrivacyConsentPopup from "@/components/privacy-consent-popup"
import { usePrivacy } from "@/contexts/privacy-context"

const leatherGradientBackground = {
  backgroundImage: "linear-gradient(to bottom, rgb(37, 18, 6), rgb(12, 12, 12)), url('/images/dark-leather.png')",
  backgroundBlendMode: "multiply",
  backgroundSize: "cover, auto",
  backgroundRepeat: "no-repeat, repeat",
  backgroundPosition: "center top",
};

export default function LandingPage() {
  const { showPrivacyPopup, setShowPrivacyPopup, handleAgree, handleDecline } = usePrivacy()

  // Add useEffect to create the torch light animation
  useEffect(() => {
    // Create torch light animation that varies in intensity and slightly in position
    const torchLightKeyframes = `
      @keyframes torchFlicker {
        0% { opacity: 0.5; transform: scale(0.96); }
        10% { opacity: 0.7; transform: scale(1.03); }
        20% { opacity: 0.4; transform: scale(0.94); }
        30% { opacity: 0.8; transform: scale(1.02); }
        40% { opacity: 0.3; transform: scale(0.9); }
        50% { opacity: 0.6; transform: scale(1.01); }
        60% { opacity: 0.7; transform: scale(0.97); }
        70% { opacity: 0.4; transform: scale(1.04); }
        80% { opacity: 0.8; transform: scale(0.93); }
        90% { opacity: 0.5; transform: scale(1.0); }
        100% { opacity: 0.5; transform: scale(0.96); }
      }
      
      @keyframes torchFlicker2 {
        0% { opacity: 0.7; transform: scale(1.02); }
        15% { opacity: 0.4; transform: scale(0.95); }
        30% { opacity: 0.6; transform: scale(1.03); }
        45% { opacity: 0.8; transform: scale(0.92); }
        60% { opacity: 0.3; transform: scale(1.0); }
        75% { opacity: 0.7; transform: scale(0.97); }
        90% { opacity: 0.4; transform: scale(1.01); }
        100% { opacity: 0.7; transform: scale(1.02); }
      }
    `;

    // Add the keyframes to the document
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = torchLightKeyframes;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navigation />
      
      {/* Hero Section */}
      <section 
        className="h-screen flex items-center justify-center relative bg-cover bg-center bg-no-repeat pt-14 overflow-hidden mb-0"
        style={{ backgroundImage: "url('/images/dungeon.jpg')" }}
      >
        {/* Vignette overlay */}
        <div
          className="absolute inset-0 z-15 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)"
          }}
          aria-hidden="true"
        />

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 z-10" />

        {/* Embers video background */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-20 pointer-events-none mix-blend-screen"
          src="/videos/Embers.mp4"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        />

        <div className="container mx-auto px-4 relative z-30">
          <div className="max-w-4xl mx-auto text-center">
            <img 
              src="/images/title.png" 
              alt="Forge Your Legend" 
              className="w-full max-w-6xl h-auto mx-auto mb-6 drop-shadow-lg"
            />
            <img 
              src="/images/subtitle.png" 
              alt="Not All Characters Are Fictional. Some Fuel Science." 
              className="w-full max-w-4xl h-auto mx-auto mb-8 drop-shadow"
            />
            <p className="text-lg text-amber-200 mb-12 max-w-2xl mx-auto drop-shadow">
            Shape your story. Optimize your path. Help us build the future of D&D character creation.
            </p>
            <div className="flex justify-center">
              <FancyButton onClick={() => setShowPrivacyPopup(true)}>
                Begin Your Quest
              </FancyButton>
            </div>
          </div>
        </div>
      </section>

      {showPrivacyPopup && (
        <PrivacyConsentPopup
          onAgree={handleAgree}
          onDecline={handleDecline}
        />
      )}

      {/* Wrap both sections in a parent div with the background */}
      <div style={leatherGradientBackground} className="relative overflow-hidden">
        {/* Section Divider positioned absolutely within the background container */}
        <div className="absolute top-0 left-0 right-0 h-[44px] z-10">
          <div
            className="w-full h-[44px]"
            style={{
              backgroundImage: "url('/images/divider.png')",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "0px 0px",
              backgroundSize: "auto 88px",
              pointerEvents: "none",
            }}
            aria-hidden="true"
          />
          <div
            className="absolute left-0 right-0 -bottom-0 h-2 z-0 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0))",
              filter: "blur(6px)",
            }}
            aria-hidden="true"
          />
        </div>
        {/* About Section */}
        <section className="min-h-screen flex items-center bg-transparent relative pt-[44px]">
          {/* Left torch light effect */}
          <div className="absolute left-0 top-0 bottom-0 w-[45vw] pointer-events-none z-0" style={{
            background: "radial-gradient(ellipse at left center, rgba(255, 180, 80, 0.22) 0%, rgba(255, 180, 80, 0.10) 40%, transparent 80%)",
            animation: "torchFlicker 5.7s infinite ease-in-out",
          }}></div>

          {/* Right torch light effect */}
          <div className="absolute right-0 top-0 bottom-0 w-[45vw] pointer-events-none z-0" style={{
            background: "radial-gradient(ellipse at right center, rgba(255, 180, 80, 0.22) 0%, rgba(255, 180, 80, 0.10) 40%, transparent 80%)",
            animation: "torchFlicker2 4.3s infinite ease-in-out",
          }}></div>

          {/* Vignette overlay to hide torch edges */}
          <div className="pointer-events-none absolute inset-0 z-5" style={{
            background: "linear-gradient(90deg, rgba(20,12,4,0.85) 0%, rgba(20,12,4,0.0) 18%, rgba(20,12,4,0.0) 82%, rgba(20,12,4,0.85) 100%)"
          }} />

          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="relative flex items-center justify-center">
                {/* About Text */}
                <div className="flex-1">
                  <h2
                    className="font-display text-4xl font-bold text-center mb-8 text-amber-100 drop-shadow-lg"
                    style={{ fontFamily: 'CinzelDecorativeRegular, serif' }}
                  >
                    Understand the Research
                  </h2>
                  <p
                    className="text-lg mb-6 leading-relaxed text-center"
                    style={{ color: "#71675b" }}
                  >
                    This website is part of an Honours-level research project in Information Technology. The study aims to develop a hybrid recommender system that helps Dungeons & Dragons (D&D) players build compelling characters by combining structured data (like race, class, and ability scores) with unstructured, narrative data (like backstories and alignment).
                  </p>
                  <p
                    className="text-lg mb-6 leading-relaxed text-center"
                    style={{ color: "#71675b" }}
                  >
                    We're collecting real character data from players around the world to train and test this system. By analyzing both the mechanical and storytelling aspects of characters, the goal is to create an AI-driven tool that can offer personalized recommendations—whether you're building a new character or evolving an existing one. 
                  </p>
                  <p
                    className="text-lg leading-relaxed text-center"
                    style={{ color: "#71675b" }}
                  >
                    The research is grounded in Herbert Simon's Science of Design, with the aim of balancing creativity and logic in a game where both are essential.                  
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="min-h-screen flex items-center bg-transparent">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-display text-4xl font-bold text-center mb-4 text-amber-900 dark:text-amber-100">
                Powerful Features
              </h2>
              <p className="text-xl text-center text-amber-700 dark:text-amber-200 mb-12">
                Everything you need to create your perfect character
              </p>
              
              <div className="grid md:grid-cols-3 gap-8">
                <FantasyCard>
                  <div className="p-6 text-center">
                    <User className="h-16 w-16 mx-auto mb-4 text-amber-600" />
                    <h3 className="font-display text-xl font-semibold mb-3">Rich Identity Creation</h3>
                    <p className="text-amber-600 dark:text-amber-300 mb-4">
                    Build the bones of your character's story.
                    Define who your character is before they ever pick up a sword or cast a spell.
                    </p>
                    <ul className="text-sm text-amber-600 dark:text-amber-300 space-y-1">
                      <li>• Background selection</li>
                      <li>• Personality traits</li>
                      <li>• Ideals, bonds & flaws</li>
                      <li>• Custom appearance</li>
                    </ul>
                  </div>
                </FantasyCard>

                <FantasyCard>
                  <div className="p-6 text-center">
                    <Swords className="h-16 w-16 mx-auto mb-4 text-amber-600" />
                    <h3 className="font-display text-xl font-semibold mb-3">Flexible Mechanics</h3>
                    <p className="text-amber-600 dark:text-amber-300 mb-4">
                      Choose from multiple ability score methods and customize your character's mechanical aspects with ease.
                    </p>
                    <ul className="text-sm text-amber-600 dark:text-amber-300 space-y-1">
                      <li>• Standard array or point buy</li>
                      <li>• Skill selections</li>
                      <li>• Proficiency choices</li>
                      <li>• Equipment loadouts</li>
                    </ul>
                  </div>
                </FantasyCard>

                <FantasyCard>
                  <div className="p-6 text-center">
                    <Scroll className="h-16 w-16 mx-auto mb-4 text-amber-600" />
                    <h3 className="font-display text-xl font-semibold mb-3">Smart Progression</h3>
                    <p className="text-amber-600 dark:text-amber-300 mb-4">
                      Track your character's growth with intelligent progression tracking and spell management.
                    </p>
                    <ul className="text-sm text-amber-600 dark:text-amber-300 space-y-1">
                      <li>• Level progression</li>
                      <li>• Spell management</li>
                      <li>• Feat selections</li>
                      <li>• Auto-save progress</li>
                    </ul>
                  </div>
                </FantasyCard>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} 