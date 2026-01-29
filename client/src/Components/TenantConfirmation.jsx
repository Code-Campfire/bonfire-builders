import { useState } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { getButtonClasses, getTextareaClasses } from "../styles/helpers";
import { flexRow, flexCol, spacing } from "../styles/layout";
import { colors, confirmationColors, confirmationButtons, confirmationCard } from "../styles/colors";
import { typography } from "../styles/typography";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { issueAPI } from "../services/api";
import { toast } from "sonner";

/**
 * TenantConfirmation Component
 * Allows tenants to confirm or dispute a resolved repair issue
 * 
 * @param {Object} issue - The issue object
 * @param {Function} onConfirmation - Callback after confirmation/dispute is submitted
 */
export const TenantConfirmation = ({ issue, onConfirmation }) => {
  const [isDisputing, setIsDisputing] = useState(false);
  const [disputeNotes, setDisputeNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Only show for RESOLVED status
  if (issue.status !== "RESOLVED") {
    return null;
  }

  // If already confirmed (tenant_confirmed === true), show the result
  // If disputed (tenant_confirmed === false), allow them to respond again
  if (issue.tenant_confirmed === true) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <h2 className={typography.h2 + ' ' + flexRow.startCenter + ' ' + spacing.gap2}>
            <CheckCircle className={`h-5 w-5 ${confirmationColors.confirmed}`} />
            Repair Confirmed
          </h2>
        </CardHeader>
        <CardContent>
          <div className={colors.textMutedForeground + ' text-sm'}>
            <p>You confirmed this repair on {new Date(issue.tenant_confirmation_date).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // COMMENTED OUT: Previously showed "Repair Disputed" message which prevented re-confirmation
  // Now tenants can respond again after disputing, allowing the issue to be closed eventually
  // The first dispute is still preserved in tenant_confirmed for metrics calculation
  // if (typeof issue.tenant_confirmed === 'boolean') {
  //   return (
  //     <Card className="mb-6">
  //       <CardHeader>
  //         <h2 className={typography.h2 + ' ' + flexRow.startCenter + ' ' + spacing.gap2}>
  //           {issue.tenant_confirmed ? (
  //             <>
  //               <CheckCircle className={`h-5 w-5 ${confirmationColors.confirmed}`} />
  //               Repair Confirmed
  //             </>
  //           ) : (
  //             <>
  //               <XCircle className={`h-5 w-5 ${confirmationColors.disputed}`} />
  //               Repair Disputed
  //             </>
  //           )}
  //         </h2>
  //       </CardHeader>
  //       <CardContent>
  //         <div className={colors.textMutedForeground + ' text-sm'}>
  //           {issue.tenant_confirmed ? (
  //             <p>You confirmed this repair on {new Date(issue.tenant_confirmation_date).toLocaleDateString()}</p>
  //           ) : (
  //             <>
  //               <p>You disputed this repair on {new Date(issue.tenant_confirmation_date).toLocaleDateString()}</p>
  //               {issue.tenant_confirmation_notes && (
  //                 <p className="mt-2 italic">"{issue.tenant_confirmation_notes}"</p>
  //               )}
  //             </>
  //           )}
  //         </div>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const result = await issueAPI.confirmIssue(issue.id, true);
      toast.success("Repair confirmed! Issue has been closed.");
      if (onConfirmation) {
        onConfirmation(result.issue);
      }
    } catch (error) {
      console.error("Failed to confirm issue:", error);
      toast.error("Failed to confirm repair. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDispute = async () => {
    if (!disputeNotes.trim()) {
      toast.error("Please describe what's still wrong with the repair.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await issueAPI.confirmIssue(issue.id, false, disputeNotes.trim());
      toast.success("Dispute submitted. The issue has been reopened.");
      if (onConfirmation) {
        onConfirmation(result.issue);
      }
    } catch (error) {
      console.error("Failed to dispute issue:", error);
      toast.error("Failed to submit dispute. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsDisputing(false);
      setDisputeNotes("");
    }
  };

  const handleCancelDispute = () => {
    setIsDisputing(false);
    setDisputeNotes("");
  };

  return (
    <Card className={`mb-6 ${confirmationCard.pending}`}>
      <CardHeader>
        <h2 className={typography.h2 + ' ' + flexRow.startCenter + ' ' + spacing.gap2}>
          <AlertTriangle className={`h-5 w-5 ${confirmationColors.pending}`} />
          Confirm Repair Completion
        </h2>
      </CardHeader>
      <CardContent>
        {!isDisputing ? (
          <>
            <p className={colors.textForeground + ' mb-4'}>
              Your landlord has marked this issue as resolved. Please confirm if the repair has been completed to your satisfaction.
            </p>
            <div className={flexRow.startCenter + ' ' + spacing.gap3}>
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className={`${getButtonClasses('primary')} ${confirmationButtons.confirm}`}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isSubmitting ? "Confirming..." : "Yes, Repair is Complete"}
              </button>
              <button
                onClick={() => setIsDisputing(true)}
                disabled={isSubmitting}
                className={`${getButtonClasses('outline')} ${confirmationButtons.dispute}`}
              >
                <XCircle className="h-4 w-4 mr-2" />
                No, Issue Not Fixed
              </button>
            </div>
          </>
        ) : (
          <div className={flexCol.start + ' ' + spacing.gap4}>
            <p className={colors.textForeground}>
              Please describe what's still wrong so your landlord can address it:
            </p>
            <textarea
              value={disputeNotes}
              onChange={(e) => setDisputeNotes(e.target.value)}
              placeholder="Describe what's still wrong with the repair..."
              className={getTextareaClasses() + ' w-full'}
              rows={3}
              maxLength={500}
            />
            <div className={flexRow.startCenter + ' ' + spacing.gap3}>
              <button
                onClick={handleDispute}
                disabled={isSubmitting || !disputeNotes.trim()}
                className={getButtonClasses('destructive')}
              >
                {isSubmitting ? "Submitting..." : "Submit Dispute"}
              </button>
              <button
                onClick={handleCancelDispute}
                disabled={isSubmitting}
                className={getButtonClasses('ghost')}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TenantConfirmation;
