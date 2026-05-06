// Minimal custom copy component
const SimpleCopyButton = () => (
  <button 
    onClick={() => {
      const text = document.body.innerText
      navigator.clipboard.writeText(text)
    }}
    className="copy-btn"
  >
    📋 Copy
  </button>
)