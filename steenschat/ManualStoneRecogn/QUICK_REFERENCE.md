# Quick Reference Checklist - Stone Recognition Implementation

Use this as a quick checklist while implementing. For detailed explanations, see `IMPLEMENTATION_GUIDE.md`. For code templates, see `CODE_TEMPLATES.md`.

---

## ✅ Pre-Implementation Checklist

- [ ] Have a trained Teachable Machine model
- [ ] Model classes match stone names exactly: `rozenkwarts`, `amethist`, `citrien`, `aventurijn`, `obsidiaan`
- [ ] Model exported as TensorFlow.js format

---

## 📦 Step 1: Install Dependencies

```bash
npm install @tensorflow/tfjs
```

**OR** (alternative, simpler approach):

```bash
npm install @teachablemachine/image
```

---

## 📁 Step 2: Setup Model Files

1. Export model from Teachable Machine (TensorFlow.js format)
2. Create folder: `public/models/stone-recognition/`
3. Place files:
   - `model.json`
   - `weights.bin` (or `weights1.bin`, `weights2.bin`, etc.)
   - `metadata.json` (optional but recommended)

---

## 🔧 Step 3: Create Custom Hook

**File:** `src/Hooks/useStoneRecognition.ts`

**What it does:**
- Loads model from `/models/stone-recognition/model.json`
- Runs predictions on video frames
- Returns: `detectedStone`, `confidence`, `isModelLoaded`, `modelError`

**Key settings to adjust:**
- `CONFIDENCE_THRESHOLD = 0.7` (70% minimum confidence)
- `STABILITY_COUNT = 3` (require 3 consecutive detections)
- `PREDICTION_INTERVAL = 250` (predict every 250ms)

**See:** `CODE_TEMPLATES.md` for full code

---

## 🎥 Step 4: Update WebCamViewer

**File:** `src/Components/WebCamViewer/WebCamViewer.tsx`

**Changes needed:**
1. Import `useNavigate` from `react-router-dom`
2. Import `useStoneRecognition` hook
3. Add `showConfirmButton` state
4. Integrate hook: `const { detectedStone, confidence, ... } = useStoneRecognition(videoRef)`
5. Add confirmation button JSX
6. Add navigation handler: `navigate(\`/${detectedStone}/fact\`)`

**See:** `CODE_TEMPLATES.md` for full code

---

## 🎨 Step 5: Add CSS Styles

**File:** `src/Components/WebCamViewer/WebCamViewer.css`

**Add styles for:**
- `.confirm-button-container` (positioning)
- `.confirm-button` (button styling)
- `.loading-message` (model loading indicator)

**See:** `CODE_TEMPLATES.md` for full CSS

---

## 🧪 Step 6: Test

**Test these scenarios:**
- [ ] Model loads (check console)
- [ ] Webcam starts
- [ ] Each stone detected correctly
- [ ] Button appears when stone detected
- [ ] Button navigates to correct route
- [ ] No errors in console
- [ ] Performance is acceptable

---

## 🔍 Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Model not loading | Check file path, verify files in `public/models/stone-recognition/` |
| Wrong stone detected | Increase `CONFIDENCE_THRESHOLD` or `STABILITY_COUNT` |
| Button appears too quickly | Increase `STABILITY_COUNT` |
| Performance issues | Increase `PREDICTION_INTERVAL` to 500ms |
| Navigation not working | Verify stone name matches route exactly (case-sensitive) |
| Predictions not running | Check if video element is ready, verify webcam stream |

---

## 📝 Important Notes

1. **Class Names:** Must match exactly (case-sensitive)
2. **Model Input Size:** Usually 224x224, adjust if different
3. **Memory:** Code includes tensor cleanup to prevent leaks
4. **Browser Support:** Works in all modern browsers

---

## 🚀 Implementation Order

1. Install dependencies
2. Setup model files
3. Create hook
4. Update component
5. Add styles
6. Test

---

## 📚 Files to Reference

- **Detailed Guide:** `IMPLEMENTATION_GUIDE.md`
- **Code Templates:** `CODE_TEMPLATES.md`
- **This Checklist:** `QUICK_REFERENCE.md`

---

**Ready to start? Begin with Step 1!** 🎯

