# Visual Bell

Select an area in your browser, and get notified with a flashy and bumpy red
outline around the select element when it changes.

## Description

This is a Firefox addon which will let you select an area in the current page
after clicking on the icon of the addon.

Once selected, any modification to the selected elements, such as adding text,
will get notified to you visualy, by drawing a red outline which bounces 5 times
around the modified element which was selected previously.

This addon is useful if you require a noise free environement, such as in a
meeting, but require your immediate attention on changes of elements which is in
your peripheral view.

## Testing Locally

This addon can be tested locally by following the recommendation from the [extension workshop](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/).

To have a more persistent installation, the script `publish.sh` is used to generate a zip file which can be added in `about:addons` after [disabling signature verfification](https://blog.mozilla.org/addons/2015/12/23/loading-temporary-add-ons/).
