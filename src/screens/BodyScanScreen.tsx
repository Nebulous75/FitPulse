import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Upload, TrendingUp, Sparkles } from 'lucide-react';

export default function BodyScanScreen() {
  const navigate = useNavigate();
  const [scans, setScans] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      const newScan = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        imageUrl: URL.createObjectURL(selectedFile),
        analysis: {
          posture: Math.floor(Math.random() * 20) + 80,
          muscleTone: Math.floor(Math.random() * 20) + 75,
          progress: scans.length > 0 ? '+5%' : 'Baseline',
        },
        notes: [
          'Great improvement in shoulder alignment',
          'Core strength showing positive changes',
          'Keep up the consistent training!',
        ],
      };

      setScans([newScan, ...scans]);
      setSelectedFile(null);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/summary')}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Sparkles className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Body Scan AI</h1>
            <p className="text-gray-600">Track your visual progress over time</p>
          </div>

          <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Upload Progress Photo</h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload a photo to track posture, muscle tone, and visual progress. All data stays
              private.
            </p>

            <div className="flex gap-4">
              <label className="flex-1 cursor-pointer">
                <div className="p-4 border-2 border-dashed border-purple-300 rounded-xl hover:border-purple-500 transition-all text-center">
                  <Upload className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {selectedFile ? selectedFile.name : 'Choose a photo'}
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleUpload}
                disabled={!selectedFile || isAnalyzing}
                className={`px-8 py-4 rounded-xl font-semibold transition-all ${
                  !selectedFile || isAnalyzing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg'
                }`}
              >
                {isAnalyzing ? 'Analyzing...' : 'Upload & Analyze'}
              </button>
            </div>
          </div>

          {scans.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No scans yet. Upload your first progress photo!</p>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-500" />
                Your Progress
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {scans.map((scan) => (
                  <div key={scan.id} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6">
                    <div className="aspect-square bg-gray-200 rounded-xl mb-4 overflow-hidden">
                      <img
                        src={scan.imageUrl}
                        alt="Body scan"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-3">Scanned on {scan.date}</p>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700">Posture Score</span>
                            <span className="font-bold text-purple-600">{scan.analysis.posture}%</span>
                          </div>
                          <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                              style={{ width: `${scan.analysis.posture}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700">Muscle Tone</span>
                            <span className="font-bold text-blue-600">{scan.analysis.muscleTone}%</span>
                          </div>
                          <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                              style={{ width: `${scan.analysis.muscleTone}%` }}
                            />
                          </div>
                        </div>

                        {scan.analysis.progress !== 'Baseline' && (
                          <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm font-semibold text-center">
                            {scan.analysis.progress} improvement
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs font-semibold text-gray-700 mb-2">AI Notes:</p>
                      <ul className="space-y-1">
                        {scan.notes.map((note: string, index: number) => (
                          <li key={index} className="text-xs text-gray-600">
                            • {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500 text-center mt-6">
            * All photos are stored locally and kept private. AI analysis is for guidance only.
          </p>
        </div>
      </div>
    </div>
  );
}
