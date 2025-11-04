# AI Trauma Assessment Integration - Environment Setup

## Overview
Your React dashboard now integrates with your deployed FastAPI backend for child trauma assessment. The system allows clinicians to input narrative text and receive AI-powered trauma risk assessments displayed using your existing PredictionCard design.

## Environment Setup

### 1. Environment Variables
Create a `.env` file in your project root:

```env
# FastAPI Backend URL
REACT_APP_API_BASE=https://your-fastapi-backend-url.com

# Example for local development:
# REACT_APP_API_BASE=http://localhost:8000
```

### 2. API Endpoints Required
Your FastAPI backend should provide these endpoints:

- **Health Check**: `GET /health`
  ```json
  {
    "status": "healthy",
    "models_loaded": true
  }
  ```

- **System Info**: `GET /api/info`
  ```json
  {
    "model": "Child Trauma Assessment",
    "version": "1.0"
  }
  ```

- **Prediction**: `POST /predict`
  ```json
  // Request
  {
    "narrative": "The child reports feeling sad and not wanting to play...",
    "age": 8
  }
  
  // Response
  {
    "risk_level": "medium",
    "confidence": 0.75,
    "probabilities": {
      "low": 0.2,
      "medium": 0.5,
      "high": 0.3
    },
    "explanation": [
      {"span": "feeling sad", "score": 0.8},
      {"span": "not wanting to play", "score": 0.6}
    ],
    "trauma_type": "emotional_distress",
    "intervention_priority": "medium",
    "recommended_actions": [
      "Schedule follow-up assessment",
      "Consider therapy referral"
    ]
  }
  ```

## How It Works

### 1. Dashboard Integration
- Toggle between "Patient Records" and "AI Assessment" views
- AI Assessment view provides narrative input interface
- Results are displayed using your existing PredictionCard component
- Assessed patients can be saved to your patient list

### 2. Narrative-Based Assessment
1. **Input**: Clinician enters clinical narrative and optional patient info
2. **Analysis**: Text sent to FastAPI backend for AI processing
3. **Results**: AI extracts trauma indicators and risk assessment
4. **Display**: Results shown in familiar card format with risk levels, confidence, and recommendations
5. **Save**: Assessment can be saved as new patient record

### 3. Component Structure
```
Dashboard.jsx
├── View Toggle (Patient Records / AI Assessment)
├── Patient Records View
│   ├── PatientList (sidebar)
│   ├── NarrativeViewer
│   ├── Timeline
│   ├── NotesPanel
│   └── PredictionCard
└── AI Assessment View
    └── TraumaAssessment
        ├── Patient Info Form (optional)
        ├── Narrative Text Input
        ├── AI Analysis Button
        ├── PredictionCard (results)
        └── Save as Patient Button
```

## Testing the Integration

### 1. Start Development Server
```bash
npm run dev
```

### 2. Navigate to Dashboard
- Go to `/dashboard` route
- Toggle to "AI Assessment" view
- Check API connection status (green indicator)

### 3. Test Assessment Flow
1. Enter sample narrative:
   ```
   The child reports feeling sad and not wanting to play. 
   Parents report trouble sleeping and appetite changes. 
   Child shows withdrawal during interactions.
   ```
2. Click "Analyze with AI"
3. Verify results display in PredictionCard format
4. Test "Save as Patient" functionality

### 4. Verify Patient Integration
- Check that saved assessments appear in patient list
- Verify narrative appears in NarrativeViewer
- Confirm results show in PredictionCard

## API Integration Notes

### Request Format
The API client sends narrative text to your model:
```javascript
const response = await predict({
  narrative: "Clinical narrative text...",
  age: 8  // optional
});
```

### Response Transformation
Results are automatically transformed to match your existing PredictionCard format:
- `risk_level` → `riskLevel`
- `probabilities` → array format for display
- `explanation` → phrase highlighting
- Custom formatting for intervention priorities and actions

### Error Handling
- Connection errors show red status indicator
- Analysis errors display user-friendly messages
- Graceful fallbacks for missing API responses

## Customization

### API Base URL
Update `src/utils/api.js` if your endpoint structure differs:
```javascript
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';
```

### Prediction Format
Modify transformation logic in `TraumaAssessment.jsx` if your API returns different field names or structures.

### Styling
The component uses your existing design tokens:
- Tailwind classes match your current theme
- PredictionCard integration maintains visual consistency
- Responsive design matches dashboard patterns

## Deployment Checklist

- [ ] Set `REACT_APP_API_BASE` environment variable
- [ ] Verify FastAPI backend endpoints are accessible
- [ ] Test CORS configuration between frontend and backend
- [ ] Confirm HTTPS setup for production API calls
- [ ] Test narrative analysis with various input types
- [ ] Verify patient data persistence
- [ ] Check responsive design on mobile devices

## Next Steps

1. **Test with Real Data**: Use actual clinical narratives to validate AI responses
2. **Refine Transformations**: Adjust data mapping based on your model's output format
3. **Add Validation**: Implement client-side validation for narrative length/quality
4. **Enhance UX**: Add loading states, progress indicators, or real-time analysis
5. **Security**: Implement authentication for API calls if needed