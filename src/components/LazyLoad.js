import { Suspense, lazy } from "react";

// LazyLoad 컴포넌트 생성
const LazyLoad = (Component) => {
  return (
    <Suspense fallback={null}>
      <Component />
    </Suspense>
  );
};

export default LazyLoad;
