import React from 'react';
// SVG를 React 컴포넌트로 import
import { ReactComponent as Tour } from "../../assets/categoryImojis/etc.svg";

const Main = () => {
    return (
        <div>
            <h1>mainpage</h1>
            {/* SVG 컴포넌트로 사용 */}
            <Tour alt="Tour category icon" />
        </div>
    );
};

export default Main;