const BankDetails = () => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-dashboard-dark/50 rounded-lg border border-dashboard-accent1/20">
        <h3 className="text-dashboard-accent2 font-medium mb-2">Bank Details</h3>
        <div className="space-y-2 text-dashboard-text">
          <p>HSBC Bank</p>
          <p>Pakistan Welfare Association</p>
          <p>Burton On Trent</p>
          <p>Sort Code: 40-15-31</p>
          <p>Account: 41024892</p>
        </div>
      </div>

      <div className="p-4 bg-dashboard-warning/10 rounded-lg border border-dashboard-warning/20">
        <h3 className="text-dashboard-warning font-medium mb-2">Important Instructions</h3>
        <div className="space-y-2 text-dashboard-text">
          <p>When making a bank transfer, please:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Use your <span className="font-medium text-dashboard-warning">Member ID as the payment reference</span></li>
            <li>Take a screenshot of the completed transfer</li>
            <li>Send the screenshot to your collector for validation</li>
          </ol>
          <p className="text-sm text-dashboard-warning mt-2">
            Your payment will only be processed after the collector validates your transfer screenshot.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BankDetails;