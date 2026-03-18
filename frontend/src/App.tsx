import { useState, type ChangeEvent } from "react";
import { Html5Qrcode } from "html5-qrcode";

function App() {
  const [inputText, setInputText] = useState<string>("");
  const [uploadResult, setUploadResult] = useState<string>("");

  const downloadCustomQR = () => {
    if (!inputText) {
      alert("Isi teks dulu ya!");
      return;
    }

    const url = `http://localhost:3000/api/generate-dynamic?text=${encodeURIComponent(inputText)}`;
    window.location.href = url;
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const html5QrCode = new Html5Qrcode("reader");
    try {
      const decodedText = await html5QrCode.scanFile(file, true);
      setUploadResult(decodedText);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("QR tidak terbaca.");
    }
  };

  return (
    <div
      style={{ textAlign: "center", padding: "40px", fontFamily: "sans-serif" }}
    >
      <h1>Custom QR Generator & Scanner</h1>

      {/* SEKSI INPUT & DOWNLOAD */}
      <div
        style={{
          marginBottom: "30px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
        }}
      >
        <h3>1. Buat QR Anda Sendiri</h3>
        <input
          type="text"
          placeholder="Ketik sesuatu di sini..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{ padding: "10px", width: "250px", marginRight: "10px" }}
        />
        <button
          onClick={downloadCustomQR}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Download QR
        </button>
      </div>

      {/* SEKSI UPLOAD & VERIFIKASI */}
      <div
        style={{
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
        }}
      >
        <h3>2. Uji QR yang Baru Diunduh</h3>
        <input type="file" accept="image/*" onChange={handleFileUpload} />

        {uploadResult && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#d4edda",
              color: "#155724",
            }}
          >
            <p>Isi QR yang terdeteksi:</p>
            <h2 style={{ margin: 0 }}>{uploadResult}</h2>
            {uploadResult === inputText ? (
              <p>
                <strong>✅ Sesuai dengan yang Anda ketik!</strong>
              </p>
            ) : (
              <p>
                <strong>⚠️ Isinya berbeda.</strong>
              </p>
            )}
          </div>
        )}
      </div>

      <div id="reader" style={{ display: "none" }}></div>
    </div>
  );
}

export default App;
