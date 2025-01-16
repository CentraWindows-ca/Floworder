import React, { useRef, useEffect, useContext } from 'react'
import { GeneralContext } from 'lib/provider/GeneralProvider.js'
import { useNProgress } from '@tanem/react-nprogress'
import cn from 'classnames'

// styles
import style from './style'

/**
 * Loadingbar wrapper
 */
export default style(({className}) => {
	const [loadingStatus] = useContext(GeneralContext).loadingBar

	const { animationDuration, isFinished, progress } = useNProgress({
		isAnimating: loadingStatus > 0,
	})

	const isFailure = loadingStatus === -1
	return isFinished && !isFailure ? null : <Bar isLoading={loadingStatus > 0} className = {className} animationDuration={animationDuration} progress={progress} isFailure={isFailure} />
})


const Bar = style(({ className, isLoading, progress, animationDuration, isFailure }) => (
	<>
		<div
			style={{
				background: isFailure ? '#F00' : '#08daff',
				height: 2,
				left: 0,
				marginLeft: `${(-1 + progress) * 100}%`,
				position: 'fixed',
				top: 0,
				transition: `margin-left ${animationDuration}ms linear`,
				width: '100%',
				zIndex: 1201,
			}}
		>
			<div
				style={{
					boxShadow: '0 0 10px #08daff, 0 0 5px #08daff',
					display: 'block',
					height: '100%',
					opacity: 1,
					position: 'absolute',
					right: 0,
					transform: 'rotate(3deg) translate(0px, -4px)',
					width: 100,
				}}
			/>
		</div>
		<div className={cn(className, isLoading ? 'overlay' : 'normal')}></div>
	</>
))
