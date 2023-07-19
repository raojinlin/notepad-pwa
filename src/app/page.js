'use client'
import React from "react";
import Notepad from "@/app/components/Notepad";
import styles from '@/app/components/Notepad/notepad.module.css';


/*
setAutoDarkClass
@link https://developer.chrome.com/blog/auto-dark-theme/#customizing-a-large-number-of-elements
*/
function setAutoDarkClass() {
  // We can also use JavaScript to generate the detection element.
  const detectionDiv = document.createElement('div');
  detectionDiv.style.display = 'none';
  detectionDiv.style.backgroundColor = 'canvas';
  detectionDiv.style.colorScheme = 'light';
  document.body.appendChild(detectionDiv);
  // If the computed style is not white then the page is in Auto Dark Theme.
  const isAutoDark = getComputedStyle(detectionDiv).backgroundColor === 'rgb(255, 255, 255)';

  // remove the detection element from the DOM.
  document.body.removeChild(detectionDiv);

  // Set the marker class on the body if in Auto Dark Theme.
  if (isAutoDark) {
    document.body.classList.add(styles.autoDarkTheme);
  }
}

export default function Home() {
  React.useEffect(() => {
    setAutoDarkClass();
    // document.addEventListener("DOMContentLoaded", setAutoDarkClass);
    // return () => {
    //   document.removeEventListener('DOMContentLoaded', setAutoDarkClass);
    // }
  }, []);

  return (
    <main>
      <div>
        <Notepad />
      </div>
    </main>
  )
}
