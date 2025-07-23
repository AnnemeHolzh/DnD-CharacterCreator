import { useState, useCallback, useEffect } from 'react'
import { FeedbackService, type Feedback, type FeedbackWithId } from '@/lib/services/feedback-service'
import { useToast } from '@/hooks/use-toast'
import { detectBrowser } from '@/lib/utils/browser-detection'

export function useFeedback() {
  const [feedback, setFeedback] = useState<FeedbackWithId[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [userIdentifier, setUserIdentifier] = useState<string>('')
  const { toast } = useToast()

  // Initialize user identifier on mount
  useEffect(() => {
    const identifier = FeedbackService.generateUserIdentifier()
    setUserIdentifier(identifier)
  }, [])

  // Load all feedback
  const loadFeedback = useCallback(async () => {
    setLoading(true)
    try {
      const allFeedback = await FeedbackService.getAllFeedback()
      setFeedback(allFeedback)
    } catch (error) {
      console.error('Error loading feedback:', error)
      toast({
        title: "Error",
        description: "Failed to load feedback. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Save new feedback
  const saveFeedback = useCallback(async (feedbackData: { feedback: string; userEmail?: string }): Promise<string | null> => {
    setSaving(true)
    try {
      if (!feedbackData.feedback.trim()) {
        toast({
          title: "Error",
          description: "Please enter your feedback or suggestion.",
          variant: "destructive"
        })
        return null
      }

      // Get browser information
      const browserInfo = detectBrowser()
      const feedbackWithBrowser = {
        ...feedbackData,
        browserInfo: {
          name: browserInfo.name,
          version: browserInfo.version,
          platform: browserInfo.platform,
          isMobile: browserInfo.isMobile,
          isTablet: browserInfo.isTablet,
          isDesktop: browserInfo.isDesktop
        }
      }

      const feedbackId = await FeedbackService.saveFeedback(feedbackWithBrowser)
      
      // Reload feedback to get the updated list
      await loadFeedback()
      
      toast({
        title: "Success",
        description: "Thank you for your feedback!",
      })
      
      return feedbackId
    } catch (error) {
      console.error('Error saving feedback:', error)
      toast({
        title: "Error",
        description: "Failed to save feedback. Please try again.",
        variant: "destructive"
      })
      return null
    } finally {
      setSaving(false)
    }
  }, [loadFeedback, toast])

  // Upvote feedback
  const upvoteFeedback = useCallback(async (feedbackId: string): Promise<boolean> => {
    try {
      const wasUpvoted = await FeedbackService.upvoteFeedback(feedbackId, userIdentifier)
      
      // Reload feedback to get updated upvote counts
      await loadFeedback()
      
      if (wasUpvoted) {
        toast({
          title: "Upvoted",
          description: "Your upvote has been added!",
        })
      } else {
        toast({
          title: "Upvote Removed",
          description: "Your upvote has been removed.",
        })
      }
      
      return wasUpvoted
    } catch (error) {
      console.error('Error upvoting feedback:', error)
      toast({
        title: "Error",
        description: "Failed to upvote. Please try again.",
        variant: "destructive"
      })
      return false
    }
  }, [userIdentifier, loadFeedback, toast])

  // Delete feedback (admin function)
  const deleteFeedback = useCallback(async (feedbackId: string): Promise<boolean> => {
    try {
      await FeedbackService.deleteFeedback(feedbackId)
      
      // Reload feedback to get the updated list
      await loadFeedback()
      
      toast({
        title: "Success",
        description: "Feedback deleted successfully!",
      })
      
      return true
    } catch (error) {
      console.error('Error deleting feedback:', error)
      toast({
        title: "Error",
        description: "Failed to delete feedback. Please try again.",
        variant: "destructive"
      })
      return false
    }
  }, [loadFeedback, toast])

  // Check if user has upvoted a specific feedback
  const hasUserUpvoted = useCallback((feedbackItem: FeedbackWithId): boolean => {
    return feedbackItem.upvotedBy?.includes(userIdentifier) || false
  }, [userIdentifier])

  return {
    feedback,
    loading,
    saving,
    userIdentifier,
    loadFeedback,
    saveFeedback,
    upvoteFeedback,
    deleteFeedback,
    hasUserUpvoted
  }
} 