import React from "react";

const SharedDoc = () => {
  // Example Google Docs embed link (replace with your actual shared document link)
  const googleDocsUrl = "https://drive.google.com/embeddedfolderview?id=1K71q3N6ivtq_nLDq9mNYjaxLMFSBH-lg#grid";

  return (
    <div className="min-h-screen bg-purple-50 dark:bg-slate-800 p-4">
      <iframe
        src={googleDocsUrl}
        style={{width: '100%', height: '100vh'}}
        frameBorder="0"
        title="Shared Google Doc"
      ></iframe>
    </div>
  );
};

export default SharedDoc;
