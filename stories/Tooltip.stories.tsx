import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Tooltip, TooltipProps } from '../src/Tooltip';

const meta: Meta = {
  title: 'Tooltip',
  component: Tooltip,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<TooltipProps> = args => <Tooltip {...args} />;

export const Default = Template.bind({});

Default.args = {
  children: <input type="text" value={"Some very cool content"}/>,
  text: "This is tooltip!",
  id: "tooltipId"
};

export const Hovered = Template.bind({});

Hovered.args = {
  children: <div>Some very cool content</div>,
  text: "This is tooltip!",
  id: "tooltipId",
  open: true
};

