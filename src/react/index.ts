"use client";
import { create } from "./create.js";

export const A = create({
  elementClass: (await import("../web-components/a/a.js")).default,
});

export const Alert = create({
  elementClass: (await import("../web-components/alert/alert.js")).default,
});

export const Avatar = create({
  elementClass: (await import("../web-components/avatar/avatar.js")).default,
});

export const Button = create({
  elementClass: (await import("../web-components/button/button.js")).default,
});

export const Card = create({
  elementClass: (await import("../web-components/card/card.js")).default,
});

export const Carousel = create({
  elementClass: (await import("../web-components/carousel/carousel.js")).default,
});

export const Details = create({
  elementClass: (await import("../web-components/details/details.js")).default,
});

export const Dialog = create({
  elementClass: (await import("../web-components/dialog/dialog.js")).default,
});

export const Form = create({
  elementClass: (await import("../web-components/form/form.js")).default,
});

export const AvatarGroup = create({
  elementClass: (await import("../web-components/group/avatar-group.js")).default,
});

export const DetailsGroup = create({
  elementClass: (await import("../web-components/group/details-group.js")).default,
});

export const Input = create({
  elementClass: (await import("../web-components/input/input.js")).default,
});

export const LabelInput = create({
  elementClass: (await import("../web-components/input/label-input.js")).default,
});

export const SearchInput = create({
  elementClass: (await import("../web-components/input/search-input.js")).default,
});

export const SelectInput = create({
  elementClass: (await import("../web-components/input/select-input.js")).default,
});

export const SplitInput = create({
  elementClass: (await import("../web-components/input/split-input.js")).default,
});

export const SwitchInput = create({
  elementClass: (await import("../web-components/input/switch-input.js")).default,
});

export const Divider = create({
  elementClass: (await import("../web-components/layout/divider.js")).default,
});

export const FlexFlow = create({
  elementClass: (await import("../web-components/layout/flex-flow.js")).default,
});

export const NavLayout = create({
  elementClass: (await import("../web-components/layout/nav-layout.js")).default,
});

export const OpenOffset = create({
  elementClass: (await import("../web-components/offset/open-offset.js")).default,
});

export const Progress = create({
  elementClass: (await import("../web-components/progress/progress.js")).default,
});

export const RouterA = create({
  elementClass: (await import("../web-components/router/router-a.js")).default,
});

export const Router = create({
  elementClass: (await import("../web-components/router/router.js")).default,
});

export const Skeleton = create({
  elementClass: (await import("../web-components/skeleton/skeleton.js")).default,
});

export const Tabs = create({
  elementClass: (await import("../web-components/tabs/tabs.js")).default,
});

export const Clip = create({
  elementClass: (await import("../web-components/text/clip.js")).default,
});

export const Overbreath = create({
  elementClass: (await import("../web-components/text/overbreath.js")).default,
});

export const Time = create({
  elementClass: (await import("../web-components/text/time.js")).default,
});

export const Typewriter = create({
  elementClass: (await import("../web-components/text/typewriter.js")).default,
});

export const Tooltip = create({
  elementClass: (await import("../web-components/tooltip/tooltip.js")).default,
});

export const Dragbox = create({
  elementClass: (await import("../web-components/wrapper/dragbox.js")).default,
});

export const Wrapper = create({
  elementClass: (await import("../web-components/wrapper/wrapper.js")).default,
});
