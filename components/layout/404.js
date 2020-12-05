import React from 'react';
import { css } from '@emotion/core';

const Error404 = () => {
    return (<h1
        css={css`
            margin: 5rem;
            text-align: center;
        `}
    >La Página no se puede mostrar :(</h1>);
}

export default Error404;