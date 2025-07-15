import { ref, set, get, push, remove, query, orderByChild, equalTo, update } from 'firebase/database'
import { database } from '../firebase/config'

export interface Feedback {
  id: string
  feedback: string
  userEmail?: string
  upvotes: number
  createdAt: number
  updatedAt: number
  upvotedBy: string[] // Array of user identifiers (could be IP, session ID, etc.)
}

export interface FeedbackWithId extends Feedback {
  id: string
}

export class FeedbackService {
  private static FEEDBACK_REF = 'feedback'

  /**
   * Save a new feedback/suggestion
   */
  static async saveFeedback(feedback: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'upvotedBy'>): Promise<string> {
    try {
      const newFeedback: Omit<FeedbackWithId, 'id'> = {
        ...feedback,
        upvotes: 0,
        upvotedBy: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }

      // Generate a new reference and get the key
      const newFeedbackRef = push(ref(database, this.FEEDBACK_REF))
      const feedbackId = newFeedbackRef.key!

      // Save the feedback
      await set(newFeedbackRef, newFeedback)

      console.log('Feedback saved successfully with ID:', feedbackId)
      return feedbackId
    } catch (error) {
      console.error('Error saving feedback:', error)
      throw new Error('Failed to save feedback')
    }
  }

  /**
   * Get all feedback sorted by upvotes (descending)
   */
  static async getAllFeedback(): Promise<FeedbackWithId[]> {
    try {
      const feedbackRef = ref(database, this.FEEDBACK_REF)
      const snapshot = await get(feedbackRef)

      if (snapshot.exists()) {
        const feedback: FeedbackWithId[] = []
        snapshot.forEach((childSnapshot) => {
          feedback.push({
            id: childSnapshot.key!,
            ...childSnapshot.val()
          })
        })
        
        // Sort by upvotes (descending) then by creation date (newest first)
        return feedback.sort((a, b) => {
          if (b.upvotes !== a.upvotes) {
            return b.upvotes - a.upvotes
          }
          return b.createdAt - a.createdAt
        })
      }

      return []
    } catch (error) {
      console.error('Error getting feedback:', error)
      throw new Error('Failed to get feedback')
    }
  }

  /**
   * Upvote a feedback item
   */
  static async upvoteFeedback(feedbackId: string, userIdentifier: string): Promise<boolean> {
    try {
      const feedbackRef = ref(database, `${this.FEEDBACK_REF}/${feedbackId}`)
      const snapshot = await get(feedbackRef)

      if (!snapshot.exists()) {
        throw new Error('Feedback not found')
      }

      const feedback = snapshot.val()
      const upvotedBy = feedback.upvotedBy || []

      // Check if user already upvoted
      if (upvotedBy.includes(userIdentifier)) {
        // Remove upvote
        const newUpvotedBy = upvotedBy.filter((id: string) => id !== userIdentifier)
        const newUpvotes = Math.max(0, feedback.upvotes - 1)

        await update(feedbackRef, {
          upvotes: newUpvotes,
          upvotedBy: newUpvotedBy,
          updatedAt: Date.now()
        })

        console.log('Upvote removed from feedback:', feedbackId)
        return false // Return false to indicate upvote was removed
      } else {
        // Add upvote
        const newUpvotedBy = [...upvotedBy, userIdentifier]
        const newUpvotes = feedback.upvotes + 1

        await update(feedbackRef, {
          upvotes: newUpvotes,
          upvotedBy: newUpvotedBy,
          updatedAt: Date.now()
        })

        console.log('Upvote added to feedback:', feedbackId)
        return true // Return true to indicate upvote was added
      }
    } catch (error) {
      console.error('Error upvoting feedback:', error)
      throw new Error('Failed to upvote feedback')
    }
  }

  /**
   * Delete a feedback item (admin function)
   */
  static async deleteFeedback(feedbackId: string): Promise<void> {
    try {
      const feedbackRef = ref(database, `${this.FEEDBACK_REF}/${feedbackId}`)
      await remove(feedbackRef)
      console.log('Feedback deleted successfully:', feedbackId)
    } catch (error) {
      console.error('Error deleting feedback:', error)
      throw new Error('Failed to delete feedback')
    }
  }

  /**
   * Get feedback by ID
   */
  static async getFeedback(feedbackId: string): Promise<FeedbackWithId | null> {
    try {
      const feedbackRef = ref(database, `${this.FEEDBACK_REF}/${feedbackId}`)
      const snapshot = await get(feedbackRef)

      if (snapshot.exists()) {
        return {
          id: feedbackId,
          ...snapshot.val()
        }
      }

      return null
    } catch (error) {
      console.error('Error getting feedback:', error)
      throw new Error('Failed to get feedback')
    }
  }

  /**
   * Generate a simple user identifier (for demo purposes)
   * In production, you might want to use a more sophisticated method
   */
  static generateUserIdentifier(): string {
    // Simple identifier based on timestamp and random number
    // In production, consider using session IDs, IP addresses, or user accounts
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
} 