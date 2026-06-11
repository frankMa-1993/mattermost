// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import styled from 'styled-components';

import LongzhiLogo from 'components/common/svg_images_components/longzhi_logo_svg';

const ProductBrandingFreeEditionContainer = styled.span`
    display: flex;
    align-items: center;
`;

const StyledLogo = styled(LongzhiLogo)`
    color: var(--sidebar-text, #000000);
`;

const ProductBrandingFreeEdition = (): JSX.Element => {
    return (
        <ProductBrandingFreeEditionContainer tabIndex={-1}>
            <StyledLogo
                width={120}
                height={28}
            />
        </ProductBrandingFreeEditionContainer>
    );
};

export default ProductBrandingFreeEdition;
