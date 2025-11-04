import React, { useState, useEffect } from "react";
import { predict, getHealth, getInfo } from "../utils/api";
import { Activity, AlertTriangle, CheckCircle, RefreshCw, Save, FileText, User } from 'lucide-react';
import PredictionCard from './PredictionCard';

/**
 * Narrative-based Child Trauma Assessment component
 * Clinicians input narrative text, AI analyzes and returns results in PredictionCard format
 */
export default function TraumaAssessment({ onSavePatient }) {
  // State for narrative input and patient info
  const [narrative, setNarrative] = useState('');
  const [patientInfo, setPatientInfo] = useState({
    age: ''
  });
  
  // State for API and results
  const [loading, setLoading] = useState(false);
  const [apiHealth, setApiHealth] = useState(null);
  const [apiInfo, setApiInfo] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);

  // Check API health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await getHealth();
        setApiHealth(health);
        const info = await getInfo();
        setApiInfo(info);
      } catch {
        setApiHealth({ status: "error" });
      }
    };
    checkHealth();
  }, []);

  // Handle narrative analysis
  const handleAnalyzeNarrative = async () => {
    if (!narrative.trim()) {
      return;
    }

    setLoading(true);
    try {
      // Send narrative to the AI model
      const response = await predict({
        narrative: narrative.trim(),
        age: patientInfo.age || null,
        // The model should extract trauma indicators from the narrative text
      });
      
      // Transform AWS API response to match PredictionCard format
      const transformedResult = {
        riskLevel: response.risk_level || 'medium',
        confidence: response.confidence || 0.75,
        // Convert model predictions to probabilities array format for display
        probabilities: response.model_predictions ? 
          Object.entries(response.model_predictions).map(([model, prediction]) => ({
            type: model,
            // Extract percentage from strings like "HIGH (77.8%)" or use probability
            score: typeof prediction === 'string' && prediction.includes('(') ?
              parseFloat(prediction.match(/\((\d+\.?\d*)%\)/)?.[1] || '0') / 100 :
              response.probability || 0.5
          })) : [
            { type: 'Overall Risk', score: response.probability || 0.5 }
          ],
        // Create explanation from processing details and confidence
        explanation: [
          { 
            span: `AI analysis (${response.processing_details?.models_used?.join(', ') || 'Multiple models'})`, 
            score: response.confidence || 0.75 
          },
          {
            span: `Narrative length: ${response.processing_details?.narrative_length || 'N/A'} characters`,
            score: response.probability || 0.5
          }
        ],
        traumaType: 'Child Trauma Assessment',
        interventionPriority: response.risk_level?.toLowerCase() || 'medium',
        recommendedActions: response.recommendations || [
          'Review assessment results with clinical team',
          'Consider follow-up evaluation',
          'Monitor child\'s wellbeing'
        ],
        // Store original response for debugging
        rawResponse: response,
        narrative: narrative,
        patientInfo: patientInfo
      };
      
      setPredictionResult(transformedResult);
    } catch (error) {
      console.error("Narrative analysis error:", error);
      setPredictionResult({ error: "Failed to analyze narrative" });
    } finally {
      setLoading(false);
    }
  };

  // Save results as new patient
  const handleSaveAsPatient = () => {
    if (onSavePatient && predictionResult && !predictionResult.error) {
      const patientData = {
        id: `P-${String(Date.now()).slice(-5)}`,
        name: `Patient (Age ${patientInfo.age || 'Unknown'})`,
        age: parseInt(patientInfo.age) || 0,
        narratives: [{
          id: `n-${Date.now()}`,
          text: narrative,
          date: new Date().toISOString().split('T')[0]
        }],
        lastPrediction: {
          riskLevel: predictionResult.riskLevel,
          confidence: predictionResult.confidence,
          probabilities: predictionResult.probabilities,
          explanation: predictionResult.explanation
        },
        assessmentDate: new Date().toISOString(),
        status: 'new'
      };
      
      onSavePatient(patientData);
      
      // Reset form
      setNarrative('');
      setPatientInfo({ age: '' });
      setPredictionResult(null);
    }
  };

  const clearAll = () => {
    setNarrative('');
    setPatientInfo({ age: '' });
    setPredictionResult(null);
  };

  // Loading state
  if (!apiHealth) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center space-x-3">
          <RefreshCw className="animate-spin text-blue-600" size={20} />
          <span className="text-gray-600">Connecting to AI service...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (apiHealth.status === "error") {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-red-200">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="text-red-500" size={20} />
          <div>
            <h3 className="text-red-700 font-medium">AI Service Unavailable</h3>
            <p className="text-red-600 text-sm">Unable to connect to the trauma assessment service. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* API Status */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <CheckCircle className="text-green-500" size={20} />
          <div>
            <h3 className="text-green-700 font-medium">AI Service Connected</h3>
            <p className="text-green-600 text-sm">
              {apiHealth?.service || "Child Trauma Assessment API"} 
              {apiHealth?.models_loaded ? " • Models Loaded" : " • Loading Models..."}
            </p>
            {apiInfo && apiInfo.model && (
              <p className="text-green-600 text-xs">
                Model: {apiInfo.model} v{apiInfo.version || "1.0"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Patient Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <User className="text-blue-600" size={24} />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Patient Information</h2>
              <p className="text-gray-600 text-sm">Basic patient details (optional)</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age (optional)</label>
            <input
              type="number"
              min="3"
              max="18"
              value={patientInfo.age}
              onChange={(e) => setPatientInfo(prev => ({ ...prev, age: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 max-w-xs"
              placeholder="Enter child's age"
            />
          </div>
        </div>
      </div>

      {/* Narrative Input */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="text-blue-600" size={24} />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Clinical Narrative</h2>
              <p className="text-gray-600 text-sm">Enter your clinical observations and notes about the child</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Narrative Text
              </label>
              <textarea
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={8}
                placeholder="Enter detailed clinical observations about the child's behavior, statements, symptoms, and any other relevant information..."
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {narrative.length} characters
              </div>
            </div>

            {/* Example narratives for guidance */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Example narratives:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• "The child reports feeling sad and not wanting to play. Parents report trouble sleeping and appetite changes."</li>
                <li>• "Child shows signs of withdrawal and decreased eye contact during interactions. Reports nightmares about recent events."</li>
                <li>• "Exhibits hypervigilance and startles easily. Describes feeling unsafe at home. Shows regression in social skills."</li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleAnalyzeNarrative}
                disabled={loading || !narrative.trim()}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin" size={20} />
                    <span>Analyzing narrative...</span>
                  </>
                ) : (
                  <>
                    <Activity size={20} />
                    <span>Analyze with AI</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={clearAll}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results using existing PredictionCard */}
      {predictionResult && !predictionResult.error && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">AI Analysis Results</h3>
            <button
              onClick={handleSaveAsPatient}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700"
            >
              <Save size={16} />
              <span>Save as Patient</span>
            </button>
          </div>
          
          <PredictionCard 
            prediction={{
              riskLevel: predictionResult.riskLevel,
              confidence: predictionResult.confidence,
              probabilities: predictionResult.probabilities,
              explanation: predictionResult.explanation
            }}
            patient={{
              name: 'New Assessment',
              age: patientInfo.age
            }}
          />
        </div>
      )}

      {/* Error Display */}
      {predictionResult?.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="text-red-500" size={20} />
            <div>
              <h4 className="text-red-700 font-medium">Analysis Error</h4>
              <p className="text-red-600 text-sm">{predictionResult.error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}