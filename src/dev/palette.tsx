import {
    Category,
    Component,
    Variant,
    Palette,
} from '@react-buddy/ide-toolbox';

// eslint-disable-next-line react/display-name
export default () => (
    <Palette>
        <Category name="Text">
            <Component name="Hello message">
                <Variant>
                    <span> Hello, Create React Buddy App! </span>
                </Variant>
            </Component>
        </Category>
    </Palette>
);