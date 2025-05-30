import { Button } from "@/components/ui/button"
import { Scroll, Shield, Beaker, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface PrivacyConsentPopupProps {
  onAgree: () => void
  onDecline: () => void
}

export default function PrivacyConsentPopup({ onAgree, onDecline }: PrivacyConsentPopupProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] border border-amber-900/50 rounded-lg p-6 max-w-2xl w-full shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <Scroll className="h-8 w-8 text-amber-500" />
          <h2 className="text-2xl font-display text-amber-100">A Scroll of Transparency</h2>
        </div>

        <div className="space-y-6 text-amber-100/90">
          <div className="flex gap-3">
            <Shield className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">Your privacy is sacred.</h3>
              <p>This tool collects no personal data, no login is required, and no cookies are used to track you.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Scroll className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">Only your character matters.</h3>
              <p>The only data being collected is the information you provide about your character—completely anonymously. That means your choices, backstory, and build will be used purely for research purposes, with no way to link it back to you.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Beaker className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">For research, not riches.</h3>
              <p>This data helps train a hybrid recommender system as part of an Honours research project in Information Technology. Your contribution helps build a smarter, more narrative-aware D&D tool for players around the world.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">Important Notice</h3>
              <p>By continuing, you acknowledge that your character data may be included in academic research, but your identity remains entirely anonymous and untraceable.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Button
            onClick={onAgree}
            className="bg-amber-600 hover:bg-amber-700 text-white px-8"
          >
            I Agree
          </Button>
          <Link href="/research-details.pdf" target="_blank">
            <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-600/10 px-8">
              Learn More
            </Button>
          </Link>
          <Button
            onClick={onDecline}
            variant="ghost"
            className="text-amber-600 hover:bg-amber-600/10 px-8"
          >
            No Thanks
          </Button>
        </div>
      </div>
    </div>
  )
} 