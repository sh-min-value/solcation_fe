import React from "react";
import Header from "../common/Header.js";
import NavigationBar from "../common/NavigationBar.js";

export default function RootLayout({ children }) {
  return (
    <div className="app-layout relative">
        <Header 
        showHomeButton={true} 
        /> 
        <main className="app-main">{children}</main>
        <NavigationBar />
    </div>
  );
}
