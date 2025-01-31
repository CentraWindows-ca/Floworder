import React, { useState, useCallback } from "react"
import { Typeahead, withAsync, Highlighter } from "react-bootstrap-typeahead"
// styles
import style from "./style"

const AsyncTypeahead = withAsync(Typeahead);


/**
 * Typeahead wrapper
 */
export default React.memo(style(
	React.forwardRef(({
		placeholder = "search...",
		clearButton = true,
		value,
		onChange,
		valueKey = "",
		labelKey = "",
		onSearch,
		renderPrefix,
		renderSuffix,
		initOptions = [],
		...rest
	}, ref) => {

		const [options, setOptions] = useState([])
		const [isLoading, setIsLoading] = useState(false)

		// default value, prevent repeat
		const _allOptions = [...options, ...initOptions]
		const _set = new Set(_allOptions.map(item => item[valueKey]))
		const allOptions = []
		for (let i = 0; i < _allOptions.length; i++) {
			if(_set.has(_allOptions[i][valueKey])) {
				allOptions.push(_allOptions[i])
				_set.delete(_allOptions[i][valueKey])
			}
		}

		const selectedValue = allOptions.find((item) => item[valueKey] === value)

		const handleOnChange = (selected) => {
			const selectedKey = selected?.[0]?.[valueKey]
			onChange(selectedKey, selected?.[0])
		}

		const handleSearch = async query => {
			setIsLoading(true)
			const results = await onSearch(query)
			setIsLoading(false)
			setOptions(results)
			return results
		}

		// workaround of the typeahead bug: sometimes wont trigger search
		const handleKeyDown = e => {
			if(e.code === 'Enter') {
				if(!isLoading) {
					handleSearch(e.target.value)
				}				
			}
		}

		const renderMenuItemChildren = useCallback((option, props, index) => {
			let label
			if (!labelKey) {
				label = option
			} else if (typeof labelKey === 'function') {
				label = labelKey(option, index)
			} else {
				label = option[labelKey]
			}

			return (
				<>
					{renderPrefix ? renderPrefix(option) : null}
					<Highlighter search={props.text}>{label}</Highlighter>
					{renderSuffix ? renderSuffix(option) : null}
				</>
			)
		}, [labelKey])

		return (
			<AsyncTypeahead
				onFocus={(e) => {
					e.target.select()
				}}
				ref={ref}
				delay={500}
				minLength={1}
				clearButton={clearButton}
				selected={selectedValue ? [selectedValue] : []}
				onChange={handleOnChange}
				options={allOptions}
				labelKey={labelKey}
				placeholder={placeholder}
				onSearch={handleSearch}
				isLoading = {isLoading}
				onKeyDown={handleKeyDown}
				useCache={false}
				renderMenuItemChildren={renderMenuItemChildren}
				{...rest}
			/>
		)
	}
)))
