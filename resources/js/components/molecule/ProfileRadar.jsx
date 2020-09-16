import React from 'react';
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css';

import server from '../../server';

export default function ProfileRadar() {
  const [radarDistribution, setRadarDistribution] = React.useState([]);
  const [captions, setCaptions] = React.useState(undefined);

  React.useEffect(() => {
    fetchRadarDistribution();
  }, []);

  console.log(radarDistribution);
  console.log(captions);

  return (
    <div className="ProfileRadar">
      {radarDistribution.length > 0 && captions.length && (
        <RadarChart
          captions={captions}
          data={radarDistribution}
          size={450}
        />
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
          setRadarDistribution([radarData]);
        }
      });
  }
}
