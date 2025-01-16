/* eslint-disable @typescript-eslint/no-unused-vars */
import { lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import navItems from "../data/sidebarData";

// Function to dynamically import pages
const loadPageComponent = (pageName: string) => {
  try {
    return lazy(() => import(`../pages/${pageName}.tsx`));
  } catch (error) {
    return null;
  }
};

export default function PageHandler() {
  const location = useLocation();

  // Find the matching page from navItems
  const page = navItems.find((item) => item.href === location.pathname);

  // Convert "/about" -> "About" for dynamic import
  const pageName = page ? page.name.replace(/\s+/g, "") : null;
  const PageComponent = pageName ? loadPageComponent(pageName) : null;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {PageComponent ? <PageComponent /> : <div>Page Not Found</div>}
    </Suspense>
  );
}
