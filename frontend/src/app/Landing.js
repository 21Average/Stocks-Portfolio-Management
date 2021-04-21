import React from "react";
import tw from "twin.macro"; //eslint-disable-line
import { css } from "styled-components/macro"; //eslint-disable-line

import AnimationRevealPage from "helpers/AnimationRevealPage";
import Hero from "components/hero/TwoColumnWithInput";
import Features from "components/features/DashedBorderSixFeatures";

const DefaultFn = () => (
    [
        <AnimationRevealPage disable>
        </AnimationRevealPage>
        
    ]
);

export default DefaultFn;