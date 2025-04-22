import React, { useState, useMemo } from 'react';
import { Calculator, ChevronRight } from 'lucide-react';

interface CameraConfig {
  continuous: Record<string, number>;
  motion: Record<string, number>;
  bitrates: Record<string, string>;
}

const RESOLUTIONS = ['720p', '2MP', '5MP', '4K'];
const BITRATE_OPTIONS = ['1024', '2048', '4096', '8192'];

// Simplified pricing model (replace with actual pricing)
const PRICE_PER_CAMERA = {
  '720p': { continuous: 10, motion: 7 },
  '2MP': { continuous: 15, motion: 10 },
  '5MP': { continuous: 20, motion: 15 },
  '4K': { continuous: 30, motion: 25 },
};

function App() {
  const [cameraConfig, setCameraConfig] = useState<CameraConfig>({
    continuous: Object.fromEntries(RESOLUTIONS.map(res => [res, 0])),
    motion: Object.fromEntries(RESOLUTIONS.map(res => [res, 0])),
    bitrates: Object.fromEntries(RESOLUTIONS.map(res => [res, '2048'])),
  });

  const handleCameraChange = (
    type: 'continuous' | 'motion',
    resolution: string,
    value: number
  ) => {
    setCameraConfig(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [resolution]: Math.max(0, value),
      },
    }));
  };

  const handleBitrateChange = (resolution: string, value: string) => {
    setCameraConfig(prev => ({
      ...prev,
      bitrates: {
        ...prev.bitrates,
        [resolution]: value,
      },
    }));
  };

  const totalCost = useMemo(() => {
    let cost = 0;
    RESOLUTIONS.forEach(resolution => {
      const continuous = cameraConfig.continuous[resolution];
      const motion = cameraConfig.motion[resolution];
      const bitrateMultiplier = parseInt(cameraConfig.bitrates[resolution]) / 2048;

      cost += continuous * PRICE_PER_CAMERA[resolution].continuous * bitrateMultiplier;
      cost += motion * PRICE_PER_CAMERA[resolution].motion * bitrateMultiplier;
    });
    return cost;
  }, [cameraConfig]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Matrix VSaaS Licensing Cost Calculator
            </h1>
          </div>
          <p className="text-gray-600">Configure your camera setup and view pricing in real-time</p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Continuous Recording Column */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b">
                Continuous Recording
              </h2>
              {RESOLUTIONS.map(resolution => (
                <div key={`continuous-${resolution}`} className="flex items-center justify-between">
                  <span className="text-gray-700">{resolution}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCameraChange('continuous', resolution, cameraConfig.continuous[resolution] - 1)}
                      className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={cameraConfig.continuous[resolution]}
                      onChange={(e) => handleCameraChange('continuous', resolution, parseInt(e.target.value) || 0)}
                      className="w-16 text-center border rounded p-1"
                    />
                    <button
                      onClick={() => handleCameraChange('continuous', resolution, cameraConfig.continuous[resolution] + 1)}
                      className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Motion Recording Column */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b">
                Motion Recording
              </h2>
              {RESOLUTIONS.map(resolution => (
                <div key={`motion-${resolution}`} className="flex items-center justify-between">
                  <span className="text-gray-700">{resolution}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCameraChange('motion', resolution, cameraConfig.motion[resolution] - 1)}
                      className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={cameraConfig.motion[resolution]}
                      onChange={(e) => handleCameraChange('motion', resolution, parseInt(e.target.value) || 0)}
                      className="w-16 text-center border rounded p-1"
                    />
                    <button
                      onClick={() => handleCameraChange('motion', resolution, cameraConfig.motion[resolution] + 1)}
                      className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bitrate Selection Column */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b">
                Bitrate Selection
              </h2>
              {RESOLUTIONS.map(resolution => (
                <div key={`bitrate-${resolution}`} className="flex items-center justify-between">
                  <span className="text-gray-700">{resolution}</span>
                  <select
                    value={cameraConfig.bitrates[resolution]}
                    onChange={(e) => handleBitrateChange(resolution, e.target.value)}
                    className="border rounded p-2 bg-white"
                  >
                    {BITRATE_OPTIONS.map(rate => (
                      <option key={rate} value={rate}>
                        {rate}kbps
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Cost Breakdown Column */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b">
                Cost Breakdown
              </h2>
              {RESOLUTIONS.map(resolution => {
                const continuousCost = cameraConfig.continuous[resolution] * 
                  PRICE_PER_CAMERA[resolution].continuous * 
                  (parseInt(cameraConfig.bitrates[resolution]) / 2048);
                const motionCost = cameraConfig.motion[resolution] * 
                  PRICE_PER_CAMERA[resolution].motion * 
                  (parseInt(cameraConfig.bitrates[resolution]) / 2048);
                
                return (
                  <div key={`cost-${resolution}`} className="space-y-2">
                    {continuousCost > 0 && (
                      <p className="text-sm text-gray-600">
                        {cameraConfig.continuous[resolution]} {resolution} continuous @ {cameraConfig.bitrates[resolution]}kbps
                        <span className="font-semibold block">
                          ${continuousCost.toFixed(2)}
                        </span>
                      </p>
                    )}
                    {motionCost > 0 && (
                      <p className="text-sm text-gray-600">
                        {cameraConfig.motion[resolution]} {resolution} motion @ {cameraConfig.bitrates[resolution]}kbps
                        <span className="font-semibold block">
                          ${motionCost.toFixed(2)}
                        </span>
                      </p>
                    )}
                  </div>
                );
              })}
              <div className="pt-4 border-t mt-auto">
                <p className="text-lg font-bold text-gray-900">
                  Total Cost: ${totalCost.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;