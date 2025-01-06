import { Card } from "@/components/ui/card";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { format } from 'date-fns';
import { AlertCircle, AlertOctagon, Check, Clock } from "lucide-react";

interface PaymentCardProps {
  annualPaymentStatus?: 'completed' | 'pending' | 'due' | 'overdue';
  emergencyCollectionStatus?: 'completed' | 'pending' | 'due' | 'overdue';
  emergencyCollectionAmount?: number;
  annualPaymentDueDate?: string;
  emergencyCollectionDueDate?: string;
  lastAnnualPaymentDate?: string;
  lastEmergencyPaymentDate?: string;
  lastAnnualPaymentAmount?: number;
  lastEmergencyPaymentAmount?: number;
}

const PaymentCard = ({ 
  annualPaymentStatus = 'pending',
  emergencyCollectionStatus = 'pending',
  emergencyCollectionAmount = 0,
  annualPaymentDueDate,
  emergencyCollectionDueDate,
  lastAnnualPaymentDate,
  lastEmergencyPaymentDate,
  lastAnnualPaymentAmount,
  lastEmergencyPaymentAmount
}: PaymentCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    try {
      return format(new Date(dateString), 'MMM do, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-[#7EBF8E]/20 text-[#7EBF8E] border border-[#7EBF8E]/30';
      case 'due':
        return 'bg-[#9b87f5]/20 text-[#9b87f5] border border-[#9b87f5]/30';
      case 'overdue':
        return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      case 'pending':
        return 'bg-[#7E69AB]/20 text-[#7E69AB] border border-[#7E69AB]/30';
      default:
        return 'bg-[#7E69AB]/20 text-[#7E69AB] border border-[#7E69AB]/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-6 w-6" />;
      case 'due':
        return <Clock className="h-6 w-6" />;
      case 'overdue':
        return <AlertOctagon className="h-6 w-6" />;
      case 'pending':
        return <AlertCircle className="h-6 w-6" />;
      default:
        return <AlertCircle className="h-6 w-6" />;
    }
  };

  return (
    <Card className="dashboard-card bg-[#1A1F2C]/80">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Annual Payment Section */}
        <div className="p-6 glass-card rounded-lg border border-[#9b87f5]/10 hover:border-[#9b87f5]/20 transition-colors">
          <h3 className="text-lg font-medium text-[#D6BCFA] mb-4">Annual Payment</h3>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-2xl font-bold text-[#E5DEFF]">£40</p>
              <p className="text-sm font-bold" style={{ color: getStatusColor(annualPaymentStatus).split(' ')[1].replace('text-', '') }}>
                Due: {formatDate(annualPaymentDueDate)}
              </p>
              {lastAnnualPaymentDate && (
                <div className="mt-2">
                  <p className="text-xs text-[#7E69AB]">
                    Last payment: {formatDate(lastAnnualPaymentDate)}
                  </p>
                  {lastAnnualPaymentAmount && (
                    <p className="text-xs text-[#7EBF8E]">
                      Amount: £{lastAnnualPaymentAmount}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm ${getStatusColor(annualPaymentStatus)}`}>
                {annualPaymentStatus}
              </span>
              <div className="w-12 h-12" style={{ color: getStatusColor(annualPaymentStatus).split(' ')[1].replace('text-', '') }}>
                {getStatusIcon(annualPaymentStatus)}
              </div>
            </div>
          </div>
          <div className="text-sm text-[#D6BCFA]">
            {annualPaymentStatus === 'completed' 
              ? 'Payment completed' 
              : (
                <div className="space-y-1">
                  <p>Payment {annualPaymentStatus}</p>
                  <p className="text-[#7E69AB]">
                    {annualPaymentStatus === 'overdue' 
                      ? 'Please complete your overdue payment immediately'
                      : 'Please complete your payment before the due date'}
                  </p>
                </div>
              )}
          </div>
        </div>

        {/* Emergency Collection Section */}
        <div className="p-6 glass-card rounded-lg border border-[#9b87f5]/10 hover:border-[#9b87f5]/20 transition-colors">
          <h3 className="text-lg font-medium text-[#D6BCFA] mb-4">Emergency Collection</h3>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-2xl font-bold text-[#E5DEFF]">
                £{emergencyCollectionAmount}
              </p>
              <p className="text-sm font-bold" style={{ color: getStatusColor(emergencyCollectionStatus).split(' ')[1].replace('text-', '') }}>
                Due: {formatDate(emergencyCollectionDueDate)}
              </p>
              {lastEmergencyPaymentDate && (
                <div className="mt-2">
                  <p className="text-xs text-[#7E69AB]">
                    Last payment: {formatDate(lastEmergencyPaymentDate)}
                  </p>
                  {lastEmergencyPaymentAmount && (
                    <p className="text-xs text-[#7EBF8E]">
                      Amount: £{lastEmergencyPaymentAmount}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm ${getStatusColor(emergencyCollectionStatus)}`}>
                {emergencyCollectionStatus}
              </span>
              <div className="w-12 h-12" style={{ color: getStatusColor(emergencyCollectionStatus).split(' ')[1].replace('text-', '') }}>
                {getStatusIcon(emergencyCollectionStatus)}
              </div>
            </div>
          </div>
          <div className="text-sm text-[#D6BCFA]">
            {emergencyCollectionStatus === 'completed' 
              ? 'Payment completed' 
              : (
                <div className="space-y-1">
                  <p>Payment {emergencyCollectionStatus}</p>
                  <p className="text-[#7E69AB]">
                    {emergencyCollectionStatus === 'overdue'
                      ? 'Emergency collection payment is overdue'
                      : 'One-time emergency collection payment required'}
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PaymentCard;