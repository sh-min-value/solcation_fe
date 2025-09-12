import React from "react";
import Header from "../common/Header.js";
import NavigationBar from "../common/NavigationBar.js";

export default function RootLayout({ children }) {
  return (
    <div className="app-layout relative">
        <Header 
        showBackButton={true}
        showHomeButton={true} 
        /> 
        <div className="bg-main m-0">
        <main className="app-main rounded-t-3xl">{children}</main>
        </div>
        <NavigationBar />
    </div>
  );
}
