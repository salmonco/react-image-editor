import Konva from "konva";
import { Image as KonvaImage, Text } from "react-konva";
import { Rect as RectType } from "konva/lib/shapes/Rect";
import { Circle as CircleType } from "konva/lib/shapes/Circle";
import React, { RefObject, useEffect, useRef, useState } from "react";
import { Rect } from "react-konva";
import { OverrideItemProps } from "../../../hook/useItem";
import { StageData } from "../../../redux/currentStageData";
import useDragAndDrop from "../../../hook/useDragAndDrop";
import useStage from "../../../hook/useStage";

export type SpecialIconItemKind = {
  "data-item-type": string;
  id: string;
  menu: string;
  icon: string;
};

export type SpecialIconItemProps = OverrideItemProps<{
  data: StageData;
  e?: DragEvent;
}>;

const SpecialIconItem: React.FC<SpecialIconItemProps> = ({
  data,
  e,
  onSelect,
}) => {
  const { attrs } = data;
  const specialIconRef = useRef() as RefObject<
    RectType | CircleType | Konva.Image
  >;
  const [imageSrc, setImageSrc] = useState<CanvasImageSource>(new Image());
  const [value, setValue] = useState(attrs.value ?? 0);
  const stage = useStage();
  const { onDragMoveFrame, onDragEndFrame, checkIsInFrame } = useDragAndDrop(
    stage.stageRef,
    stage.dragBackgroundOrigin
  );

  useEffect(() => {
    if (specialIconRef.current) {
      stage.setStageRef(specialIconRef.current.getStage()!);
      checkIsInFrame(specialIconRef.current);
    }
  }, [data]);

  useEffect(() => {
    if (attrs.menu === "sensor" || attrs.menu === "lighting")
      Konva.Image.fromURL(
        `/assets/icon/custom/${attrs.icon}-${value >= 1 ? "on" : "off"}.svg`,
        (image: Konva.Image) => {
          setImageSrc(image.image()!);
        }
      );
  }, [value]);

  const MAX_VALUE = 255;
  const TANK_HEIGHT = attrs.height;

  const handleValueChange = () => {
    // 수위 값을 20씩 증가 (최대 255)
    setValue((prev) => (prev + 20 > MAX_VALUE ? 0 : prev + 20));
  };

  const handleToggleValue = () => {
    // value를 0 또는 1로 토글
    setValue((prev) => !prev);
  };

  const renderIcon = () => {
    switch (attrs.menu) {
      case "waterTank":
        const waterHeight = (value / MAX_VALUE) * TANK_HEIGHT;
        return (
          <>
            {/* 물탱크 몸체 */}
            <Rect
              ref={specialIconRef as RefObject<RectType>}
              onClick={onSelect}
              name="label-target"
              data-item-type="specialIcon"
              id={data.id}
              x={attrs.x}
              y={attrs.y}
              width={attrs.width}
              height={attrs.height}
              fill={attrs.fill}
              stroke="#000000"
              strokeWidth={2}
              opacity={attrs.opacity ?? 1}
              rotation={attrs.rotation ?? 0}
              draggable
              onDragMove={onDragMoveFrame}
              onDragEnd={onDragEndFrame}
            />
            {/* 물 수위 표시 */}
            <Rect
              x={attrs.x}
              y={attrs.y + attrs.height - waterHeight}
              width={attrs.width}
              height={waterHeight}
              fill="blue"
            />
            {/* 수위 변경 버튼 */}
            <Rect
              x={attrs.x + 5}
              y={attrs.y + 5}
              width={50}
              height={30}
              fill="lightgray"
              cornerRadius={5}
              onClick={handleValueChange}
            />
          </>
        );
      case "sensor":
      case "lighting":
        return (
          <>
            <KonvaImage
              ref={specialIconRef as RefObject<Konva.Image>}
              image={imageSrc}
              onClick={onSelect}
              name="label-target"
              data-item-type="specialIcon"
              data-frame-type="specialIcon"
              id={data.id}
              x={attrs.x}
              y={attrs.y}
              width={attrs.width}
              height={attrs.height}
              scaleX={attrs.scaleX}
              scaleY={attrs.scaleY}
              //   fill={value >= 1 ? "yellow" : "transparent"}
              fill="transparent"
              opacity={attrs.opacity ?? 1}
              rotation={attrs.rotation ?? 0}
              draggable
              onDragMove={onDragMoveFrame}
              onDragEnd={onDragEndFrame}
            />
            {/* ON/OFF 버튼 */}
            <Rect
              x={attrs.x + attrs.width + 10}
              y={attrs.y}
              width={40}
              height={20}
              fill={value >= 1 ? "gray" : "green"}
              cornerRadius={5}
            />
            <Text
              x={attrs.x + attrs.width + 17}
              y={attrs.y + 5}
              text={value >= 1 ? "OFF" : "ON"}
              width={40}
              height={20}
              fontSize={12}
              fill="white"
              onClick={handleToggleValue}
            />
          </>
        );
      default:
        return null;
    }
  };

  return <>{renderIcon()}</>;
};

export default SpecialIconItem;
