import { Fade } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useRef } from 'react';

export default function PageTransition({ children }) {
  const location = useLocation();
  const prevKey = useRef(location.key);
  const isNew = prevKey.current !== location.key;
  prevKey.current = location.key;

  return (
    <Fade in key={location.pathname} timeout={350}>
      <div>{children}</div>
    </Fade>
  );
}
