import { camelCaseObject } from '@lunasec/browser-common';
import React, { Component, CSSProperties } from 'react';

import { RenderData, WrappedComponentProps } from '../../types';

type InputRenderData = RenderData<'Input'>;
export type InputProps = WrappedComponentProps<'Input'>;

export default class Input extends Component<InputProps> {
  constructor(props: InputProps) {
    super(props);
  }

  componentDidMount() {
    this.props.renderData.mountedCallback();
  }

  renderFrame(renderData: InputRenderData) {
    if (!renderData.frameStyleInfo) {
      return null;
    }

    const { parentStyle, width, height } = renderData.frameStyleInfo;
    const iframeStyle: CSSProperties = {
      ...camelCaseObject(parentStyle),
      display: 'block',
      width: width,
      height: height,
    };

    return (
      <iframe
        ref={renderData.frameRef}
        src={renderData.frameUrl}
        className={renderData.frameClass}
        style={iframeStyle}
        frameBorder={0}
        key={renderData.frameUrl}
      />
    );
  }

  render() {
    // Pull the renderData out so we don't weird stuff into our dummy element
    const { renderData, children, className, name, ...otherProps } = this.props;

    return (
      <div
        style={renderData.parentContainerStyle}
        className={`${renderData.containerClass} ${this.props.className || ''}`}
      >
        <input
          {...otherProps}
          ref={renderData.dummyInputStyleRef}
          style={{ ...renderData.dummyElementStyle, ...this.props.style }}
          tabIndex={-1}
          className={`${renderData.hiddenElementClass} ${this.props.className || ''}`}
        />
        <input
          {...otherProps}
          name={name} // only the element we want to submit has a name, otherwise validations run
          type="text"
          ref={renderData.dummyRef}
          style={{ ...renderData.dummyElementStyle, ...this.props.style }}
          tabIndex={-1}
          className={`${renderData.hiddenElementClass} ${this.props.className || ''}`}
        />
        {this.renderFrame(renderData)}
        {children}
      </div>
    );
  }
}