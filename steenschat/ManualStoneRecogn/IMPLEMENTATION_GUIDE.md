# Complete Step-by-Step Guide: Teachable Machine Stone Recognition

This guide will walk you through implementing stone recognition using Teachable Machine and TensorFlow.js in your WebCamViewer component.

---

## 📋 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Step 1: Install Dependencies](#step-1-install-dependencies)
3. [Step 2: Prepare Your Teachable Machine Model](#step-2-prepare-your-teachable-machine-model)
4. [Step 3: Create a Custom Hook for Stone Recognition](#step-3-create-a-custom-hook-for-stone-recognition)
5. [Step 4: Update WebCamViewer Component](#step-4-update-webcamviewer-component)
6. [Step 5: Add Confirmation Button UI](#step-5-add-confirmation-button-ui)
7. [Step 6: Add Navigation Logic](#step-6-add-navigation-logic)
8. [Step 7: Update CSS Styles](#step-7-update-css-styles)
9. [Step 8: Testing and Troubleshooting](#step-8-testing-and-troubleshooting)

---

## 1. Prerequisites

Before starting, make sure you have:
- ✅ A trained Teachable Machine model (Image Project)
- ✅ The model exported as TensorFlow.js format
- ✅ Your model should have classes matching your stone names: `rozenkwarts`, `amethist`, `citrien`, `aventurijn`, `obsidiaan`

---

## Step 1: Install Dependencies

### What you're installing:
- `@tensorflow/tfjs` - Core TensorFlow.js library
- `@tensorflow/tfjs-core` - Core operations (included in tfjs)
- These packages allow you to run machine learning models in the browser

### Action:
Open your terminal in the project root and run:

```bash
npm install @tensorflow/tfjs
```

This will add TensorFlow.js to your `package.json` dependencies.

### Why:
TensorFlow.js is needed to load and run your Teachable Machine model in the browser. It handles all the neural network computations client-side.

---

## Step 2: Prepare Your Teachable Machine Model

### What you need to do:
1. Export your model from Teachable Machine
2. Place the model files in your `public` folder

### Action:

#### 2.1 Export from Teachable Machine
1. Go to your Teachable Machine project
2. Click "Export Model"
3. Choose "TensorFlow.js" tab
4. Click "Download my model"
5. You'll get a ZIP file containing:
   - `model.json` (model architecture)
   - `weights.bin` or `weights1.bin`, `weights2.bin`, etc. (model weights)
   - `metadata.json` (class names and info)

#### 2.2 Place Files in Your Project
1. Create a folder in `public/` called `models/`
2. Inside `models/`, create a folder called `stone-recognition/`
3. Extract all files from the ZIP into `public/models/stone-recognition/`

Your structure should look like:
```
public/
  └── models/
      └── stone-recognition/
          ├── model.json
          ├── weights1.bin (or weights.bin)
          ├── weights2.bin (if multiple)
          └── metadata.json
```

### Important Notes:
- The model URL will be: `/models/stone-recognition/model.json`
- Make sure your class names in Teachable Machine match your stone names exactly (case-sensitive)
- If you have multiple weight files, TensorFlow.js will automatically load them

---

## Step 3: Create a Custom Hook for Stone Recognition

### What this does:
This hook encapsulates all the machine learning logic, making it reusable and keeping your component clean. It handles:
- Loading the model
- Running predictions on video frames
- Detecting stones with confidence thresholds
- Stability checking (avoiding false positives)

### Action:
Create a new file: `src/Hooks/useStoneRecognition.ts`

### Code Structure Explanation:

```typescript
// The hook will:
// 1. Load the model once when component mounts
// 2. Run predictions in a loop while video is active
// 3. Track detected stone with confidence
// 4. Implement stability check (same stone detected multiple times)
// 5. Return the detected stone and loading states
```

### Key Concepts:

**Model Loading:**
- Loads the model from `/models/stone-recognition/model.json`
- Only loads once (cached in ref)
- Handles loading errors gracefully

**Prediction Loop:**
- Uses `requestAnimationFrame` for smooth, efficient predictions
- Captures frames from video element
- Runs prediction every ~200-300ms (not every frame for performance)

**Confidence Threshold:**
- Only accepts predictions above 0.7 (70% confidence)
- Prevents false positives from low-confidence detections

**Stability Check:**
- Requires the same stone to be detected 3-5 times consecutively
- Prevents flickering between different stones
- Only shows confirmation button when stable

**Return Values:**
- `detectedStone`: The currently detected stone name (or null)
- `confidence`: The confidence level (0-1)
- `isModelLoaded`: Whether model finished loading
- `isPredicting`: Whether predictions are running
- `modelError`: Any error that occurred during loading

---

## Step 4: Update WebCamViewer Component

### What changes:
1. Import the custom hook
2. Import navigation hook from react-router-dom
3. Add state for showing confirmation button
4. Integrate prediction logic
5. Handle button click to navigate

### Key Changes Explained:

**Import Statements:**
- `useStoneRecognition` - Your custom hook
- `useNavigate` - React Router hook for navigation
- `StoneType` - Type for stone names (from your stones.ts)

**State Management:**
- `showConfirmButton` - Controls when to show the confirmation button
- This is separate from `detectedStone` because we only show button when stone is stable

**useEffect for Predictions:**
- Starts predictions when:
  - Model is loaded
  - Video is ready
  - No errors present
- Stops predictions when component unmounts or conditions change

**useEffect for Button Visibility:**
- Shows button when stone is detected with high confidence
- Hides button when no stone detected or confidence drops

**Overlay Logic:**
- Hide overlay when stone is detected (so user can see the stone)
- Show overlay when no stone detected (instruction message)

**Confirmation Button:**
- Only visible when `showConfirmButton` is true
- Shows detected stone name
- On click: navigates to `/{detectedStone}/fact`
- Resets detection state after navigation

---

## Step 5: Add Confirmation Button UI

### What you're adding:
A button that appears when a stone is detected, allowing the user to confirm and navigate to the fact page.

### Design Considerations:
- Should be clearly visible but not obstruct the video
- Should show which stone was detected
- Should have clear call-to-action styling
- Should match your existing design system

### Button Placement:
- Positioned absolutely over the video
- Centered or bottom-aligned
- Large enough to be easily clickable
- Styled to match your app's theme

---

## Step 6: Add Navigation Logic

### What this does:
When the user clicks the confirmation button, it navigates them to the correct fact page for the detected stone.

### Implementation:
- Use `useNavigate()` hook from react-router-dom
- Navigate to `/${detectedStone}/fact`
- Reset detection state after navigation (optional, for clean state)

### Route Matching:
Your routes in `App.tsx` already match this pattern:
- `/rozenkwarts/fact`
- `/amethist/fact`
- `/citrien/fact`
- `/aventurijn/fact`
- `/obsidiaan/fact`

So navigation will work automatically if your detected stone name matches these routes.

---

## Step 7: Update CSS Styles

### What you're adding:
Styles for the confirmation button and any updated overlay states.

### New CSS Classes Needed:

**`.confirm-button` or `.stone-confirm-button`:**
- Positioning (absolute, centered or bottom)
- Styling (background, text, padding, border-radius)
- Hover states
- Transition animations
- Z-index to appear above video

**Updated `.video-overlay`:**
- May need to hide when stone is detected
- Smooth transitions

**Optional: Confidence Indicator:**
- If you want to show confidence level
- Could be a progress bar or percentage

---

## Step 8: Testing and Troubleshooting

### Testing Checklist:

1. **Model Loading:**
   - ✅ Check browser console for loading errors
   - ✅ Verify model files are accessible (check Network tab)
   - ✅ Ensure model.json path is correct

2. **Webcam Access:**
   - ✅ Test on different browsers
   - ✅ Test with different cameras
   - ✅ Handle permission denials gracefully

3. **Stone Detection:**
   - ✅ Test with each stone type
   - ✅ Verify confidence thresholds work
   - ✅ Check stability (doesn't flicker between stones)
   - ✅ Test with no stone (should not show button)

4. **Navigation:**
   - ✅ Click button navigates correctly
   - ✅ URL matches detected stone
   - ✅ Fact page loads correctly

5. **Performance:**
   - ✅ Check CPU usage (should be reasonable)
   - ✅ Test on lower-end devices
   - ✅ Verify no memory leaks (check in DevTools)

### Common Issues and Solutions:

**Issue: Model not loading**
- **Solution:** Check file paths, ensure files are in `public/models/stone-recognition/`
- **Solution:** Check browser console for CORS errors
- **Solution:** Verify model.json is valid JSON

**Issue: Predictions not running**
- **Solution:** Check if video element is ready (`videoRef.current`)
- **Solution:** Verify webcam stream is active
- **Solution:** Check browser console for errors

**Issue: False positives (wrong stone detected)**
- **Solution:** Increase confidence threshold (0.8 or 0.9)
- **Solution:** Increase stability check count (require more consecutive detections)
- **Solution:** Retrain model with more/better training data

**Issue: Button appears too quickly**
- **Solution:** Increase stability check count
- **Solution:** Add delay before showing button

**Issue: Performance problems**
- **Solution:** Reduce prediction frequency (predict every 500ms instead of 200ms)
- **Solution:** Reduce video resolution in getUserMedia
- **Solution:** Stop predictions when component not visible

**Issue: Navigation not working**
- **Solution:** Verify stone name matches route exactly (case-sensitive)
- **Solution:** Check that useNavigate is called correctly
- **Solution:** Verify routes exist in App.tsx

---

## 🎯 Implementation Order

Follow these steps in order:

1. **Install dependencies** (Step 1)
2. **Set up model files** (Step 2)
3. **Create the hook** (Step 3) - This is the core logic
4. **Update WebCamViewer** (Step 4) - Integrate the hook
5. **Add button UI** (Step 5) - Visual confirmation
6. **Add navigation** (Step 6) - Make it functional
7. **Style everything** (Step 7) - Make it look good
8. **Test thoroughly** (Step 8) - Ensure it works

---

## 📝 Important Notes

### Model Class Names:
Your Teachable Machine classes MUST match your stone names exactly:
- `rozenkwarts` (not `Rozenkwarts` or `rozen kwarts`)
- `amethist`
- `citrien`
- `aventurijn`
- `obsidiaan`

### Performance Considerations:
- Predictions run in the browser, so they use CPU/GPU
- On slower devices, reduce prediction frequency
- Consider stopping predictions when page is not visible (Page Visibility API)

### Browser Compatibility:
- TensorFlow.js works in all modern browsers
- Some older browsers may not support WebGL (needed for GPU acceleration)
- Test on your target browsers/devices

### Model Updates:
- If you retrain your model, just replace the files in `public/models/stone-recognition/`
- No code changes needed (as long as class names stay the same)

---

## 🚀 Next Steps After Implementation

Once everything is working:

1. **Fine-tune thresholds:**
   - Adjust confidence threshold based on your model's performance
   - Adjust stability check count based on user experience

2. **Add user feedback:**
   - Loading indicator while model loads
   - Visual feedback when stone is detected (e.g., border highlight)
   - Error messages for edge cases

3. **Optimize:**
   - Consider lazy loading the model (only load when needed)
   - Add prediction throttling for better performance
   - Cache model in browser storage

4. **Enhance UX:**
   - Add sound effects
   - Add animations
   - Show confidence percentage (optional)
   - Add "try again" option if wrong stone detected

---

## 📚 Additional Resources

- [TensorFlow.js Documentation](https://www.tensorflow.org/js)
- [Teachable Machine Guide](https://teachablemachine.withgoogle.com/)
- [React Router Navigation](https://reactrouter.com/en/main/hooks/use-navigate)

---

Good luck with your implementation! 🎉

