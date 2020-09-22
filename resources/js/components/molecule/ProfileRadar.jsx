import React from 'react';
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css';

import server from '../../server';
import { viewportContext } from '../../Contexts/viewport';

export default function ProfileRadar() {
  const isMobile = React.useContext(viewportContext);
  const [radarDistribution, setRadarDistribution] = React.useState([]);
  const [captions, setCaptions] = React.useState(undefined);

  React.useEffect(() => {
    fetchRadarDistribution();
  }, []);

  return (
    <div className="ProfileRadar">
      {radarDistribution.length > 0 && captions.length > 0 && (
        <>
          <h2>Répartition de la progression</h2>
          <RadarChart
            captions={captions}
            data={radarDistribution}
            size={isMobile ? 350 : 450}
          />
        </>
      )}
    </div>
  );

  /**
   * Fetch the RadarDistribution and set it
   */
  function fetchRadarDistribution() {
    server.get('me/radarDistribution')
      .then((response) => {
        const { radarData, captionsData } = response.data;
        if (radarData && captionsData) {
          setCaptions(captionsData);
          setRadarDistribution(radarData);
        }
      });
  }
}
