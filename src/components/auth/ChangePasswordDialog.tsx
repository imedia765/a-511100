import { useState } from "react";
import { Key } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PasswordForm } from "./password/PasswordForm";
import { PasswordRequirements } from "./password/PasswordRequirements";
import { DatabaseFunctions } from "@/integrations/supabase/types/functions";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberNumber: string;
  isFirstTimeLogin?: boolean;
}

// Define the expected response type from the RPC call
interface PasswordResetResponse {
  success: boolean;
  error?: string;
  message?: string;
  code?: string;
}

// Define the input parameters manually since it's not in DatabaseFunctions yet
interface PasswordResetParams {
  member_number: string;
  new_password: string;
  ip_address?: string;
  user_agent?: string;
  client_info?: string;
}

const ChangePasswordDialog = ({
  open,
  onOpenChange,
  memberNumber,
  isFirstTimeLogin = false,
}: ChangePasswordDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: any) => {
    console.log("[PasswordChange] Starting password change process", {
      values,
      memberNumber,
      isFirstTimeLogin,
      timestamp: new Date().toISOString()
    });

    if (!values.newPassword || !values.confirmPassword || (!isFirstTimeLogin && !values.currentPassword)) {
      const error = "Missing required password fields";
      console.error("[PasswordChange] Validation error:", error);
      toast.error(error);
      return;
    }

    if (values.newPassword !== values.confirmPassword) {
      const error = "Passwords do not match";
      console.error("[PasswordChange] Validation error:", error);
      toast.error(error);
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("[PasswordChange] Preparing RPC call with params:", {
        memberNumber,
        hasNewPassword: !!values.newPassword,
        timestamp: new Date().toISOString()
      });

      const { data, error } = await supabase.rpc('handle_password_reset', {
        member_number: memberNumber,
        new_password: values.newPassword,
        ip_address: window.location.hostname,
        user_agent: navigator.userAgent,
        client_info: JSON.stringify({
          platform: navigator.platform,
          language: navigator.language,
          timestamp: new Date().toISOString(),
          isFirstTimeLogin
        })
      });

      console.log("[PasswordChange] RPC response received", {
        success: !error,
        hasData: !!data,
        error: error?.message,
        timestamp: new Date().toISOString()
      });

      if (error) {
        console.error("[PasswordChange] RPC error:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        toast.error(error.message || "Failed to change password");
        return;
      }

      const response = data as unknown as PasswordResetResponse;
      if (!response.success) {
        console.error("[PasswordChange] Operation failed:", response);
        toast.error(response.error || "Failed to change password");
        return;
      }

      console.log("[PasswordChange] Password changed successfully");
      toast.success("Password changed successfully");
      
      if (!isFirstTimeLogin) {
        onOpenChange(false);
      } else {
        window.location.reload();
      }

    } catch (error: any) {
      console.error("[PasswordChange] Unexpected error:", {
        error,
        message: error.message,
        stack: error.stack
      });
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={isFirstTimeLogin ? undefined : onOpenChange}>
      <DialogContent className="w-full max-w-md bg-dashboard-card border border-dashboard-cardBorder">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-dashboard-accent1 flex items-center gap-2">
            <Key className="w-5 h-5" />
            {isFirstTimeLogin ? "Set New Password" : "Change Password"}
          </DialogTitle>
        </DialogHeader>

        <PasswordRequirements />
        
        <PasswordForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isFirstTimeLogin={isFirstTimeLogin}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;