import styled from "styled-components"

const scom = (com) => styled(com)`
	/* css here */
	/* &>label {
		cursor: pointer;
	}
	&:hover {
		background-color: var(--light);
	} */

	&.overlay {
		background: rgba(0, 0, 0, 0);
		display: block;
		position: fixed;
		height: 100%;
		width: 100%;
		z-index: 9999999999;
		/* animation-name: overlayon;
  	animation-duration: 0.5s; */
	}

	&.normal {
		background: none;
		/* animation-name: overlayoff;
  	animation-duration: 0.5s; */
	}

	/* @keyframes overlayon {
		0%   {background: none;}
		1%   {background: rgba(0, 0, 0, 0.0);}
		100% {background: rgba(0, 0, 0, 0);}
	}

	@keyframes overlayoff {
		0%   {background: rgba(0, 0, 0, 0);}
		99%  {background: rgba(0, 0, 0, 0.0);}
		100% {background: none;}
	} */

`

export default scom
