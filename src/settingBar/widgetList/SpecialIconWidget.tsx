import React from "react";
import { Col, Figure, Row } from "react-bootstrap";
import specialIconList from "../../config/specialIcon.json";
import alignStyles from "../../style/align.module.css";
import sizeStyles from "../../style/size.module.css";
import Drag from "../../util/Drag";
import TRIGGER from "../../config/trigger";
import { SpecialIconItemKind } from "../../view/object/specialIcon";

const SpecialIconWidget: React.FC = () => (
  <Row xs={2}>
    {specialIconList.map(({ type, id, menu, icon }) => (
      <SpecialIconThumbnail
        key={`specialIcon-thumbnail-${id}`}
        data={{
          id,
          menu,
          icon,
          "data-item-type": type,
        }}
        maxPx={80}
      />
    ))}
  </Row>
);

export default SpecialIconWidget;

const SpecialIconThumbnail: React.FC<{
  maxPx: number;
  data: Omit<Omit<SpecialIconItemKind, "x">, "y">;
}> = ({ data, maxPx }) => (
  <Figure
    as={Col}
    className={[
      alignStyles.absoluteCenter,
      alignStyles.wrapTrue,
      sizeStyles.width25,
    ].join(" ")}
  >
    <Drag
      dragType="copyMove"
      dragSrc={{
        trigger: TRIGGER.INSERT.SPECIAL_ICON,
        ...data,
      }}
    >
      <i
        className={[`bi-${data.icon}`].join(" ")}
        style={{ fontSize: 20, width: 25 }}
      />
    </Drag>
    {/* <Figure.Caption
        className={[
          fontStyles.fontHalf1em,
          sizeStyles.width100,
          "text-center",
        ].join(" ")}
      >
        {`${data.id}`}
      </Figure.Caption> */}
  </Figure>
);
