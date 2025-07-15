"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Send, 
  Mail, 
  Heart,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import { FantasyFormSection } from "@/components/ui/fantasy-form-section"
import { useFeedback } from "@/hooks/use-feedback"
import { formatDistanceToNow } from "date-fns"

export function FeedbackSection() {
  const [feedbackText, setFeedbackText] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [showEmailField, setShowEmailField] = useState(false)
  const { 
    feedback, 
    loading, 
    saving, 
    loadFeedback, 
    saveFeedback, 
    upvoteFeedback, 
    hasUserUpvoted 
  } = useFeedback()

  // Load feedback on mount
  useEffect(() => {
    loadFeedback()
  }, [loadFeedback])

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) {
      return
    }
    
    const feedbackData = {
      feedback: feedbackText.trim(),
      userEmail: userEmail.trim() || undefined
    }

    const success = await saveFeedback(feedbackData)
    if (success) {
      setFeedbackText("")
      setUserEmail("")
      setShowEmailField(false)
    }
  }

  const handleUpvote = async (feedbackId: string) => {
    await upvoteFeedback(feedbackId)
  }

  const getUpvoteButtonColor = (feedbackItem: any) => {
    return hasUserUpvoted(feedbackItem) 
      ? "bg-green-900/40 border-green-600/50 text-green-300" 
      : "bg-amber-900/40 border-amber-800/30 hover:bg-amber-900/60"
  }

  return (
    <div className="space-y-8">
      {/* Submit Feedback Form */}
      <FantasyFormSection title="Share Your Feedback">
        <Card className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Feedback & Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  What's missing or could be improved?
                </label>
                <Textarea
                  placeholder="Share your thoughts, suggestions, or report issues..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="min-h-[120px] border-amber-800/30 bg-black/20 backdrop-blur-sm"
                  maxLength={1000}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {feedbackText.length}/1000 characters
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Provide your email address if you want to be notified about the progress of this suggestion
                  </span>
                </div>
                
                {showEmailField && (
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="border-amber-800/30 bg-black/20 backdrop-blur-sm"
                  />
                )}
                
                {!showEmailField && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEmailField(true)}
                    className="border-amber-800/30 bg-black/20 hover:bg-amber-900/20"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Add Email (Optional)
                  </Button>
                )}
              </div>

              <Button
                type="button"
                onClick={handleSubmitFeedback}
                disabled={saving || !feedbackText.trim()}
                className="bg-amber-900/40 border-amber-800/30 hover:bg-amber-900/60"
              >
                {saving ? (
                  <>
                    Sending <Send className="ml-2 h-4 w-4 animate-pulse" />
                  </>
                ) : (
                  <>
                    Submit Feedback <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </FantasyFormSection>

      {/* Existing Feedback */}
      <FantasyFormSection title="Community Feedback">
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading feedback...</p>
              </div>
            </div>
          ) : feedback.length === 0 ? (
            <Card className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-display mb-2">No feedback yet</h3>
                <p className="text-muted-foreground text-center">
                  Be the first to share your thoughts and suggestions!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {feedback.map((feedbackItem) => (
                <Card key={feedbackItem.id} className="border-amber-800/30 bg-black/20 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm mb-3">{feedbackItem.feedback}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>
                            {formatDistanceToNow(feedbackItem.createdAt, { addSuffix: true })}
                          </span>
                          {feedbackItem.userEmail && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              Email provided
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpvote(feedbackItem.id)}
                          className={`${getUpvoteButtonColor(feedbackItem)} transition-colors`}
                        >
                          {hasUserUpvoted(feedbackItem) ? (
                            <Heart className="h-4 w-4 fill-current" />
                          ) : (
                            <ThumbsUp className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <Badge 
                          variant="outline" 
                          className={`text-sm ${
                            feedbackItem.upvotes > 0 
                              ? "border-green-600/50 bg-green-900/20 text-green-300" 
                              : "border-amber-800/30"
                          }`}
                        >
                          {feedbackItem.upvotes} {feedbackItem.upvotes === 1 ? 'vote' : 'votes'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </FantasyFormSection>

      {/* Info Section */}
      <Card className="border-blue-800/30 bg-blue-900/10">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-300">How Feedback Works</h4>
              <ul className="text-sm text-blue-200 space-y-1">
                <li>• Share your suggestions, feature requests, or report issues</li>
                <li>• Upvote feedback you agree with to help prioritize improvements</li>
                <li>• Provide your email to get notified when your suggestions are implemented</li>
                <li>• Feedback is sorted by popularity (upvotes) and recency</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 