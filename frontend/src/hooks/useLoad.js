// Loads data from the backend when the page opens.
//   const [applications, reloadApplications] = useLoad('/applications/mine', []);
// The second value is a function that loads the data again (use it after a change).
import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';

export default function useLoad(path, startValue) {
  const [data, setData] = useState(startValue);

  const reload = useCallback(() => {
    api(path).then(setData).catch(() => {});
  }, [path]);

  useEffect(() => { reload(); }, [reload]);

  return [data, reload];
}
