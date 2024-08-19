import Konva from "konva";
import { Image as KonvaImage } from "react-konva";
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
    Konva.Image.fromURL(
      `/assets/icon/bootstrap/${attrs.icon}.svg`,
      (image: Konva.Image) => {
        setImageSrc(image.image()!);
      }
    );
  }, []);

  const renderIcon = () => {
    switch (attrs.menu) {
      case "waterTank":
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
              width={attrs.width ?? 60}
              height={attrs.height ?? 120}
              fill={attrs.fill ?? "#ccc"}
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
              y={attrs.y + (attrs.height ?? 120) - (attrs.value ?? 0)}
              width={attrs.width ?? 60}
              height={attrs.value ?? 0}
              fill="blue"
            />
          </>
        );
      case "sensor":
      case "lighting":
        return (
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
            fill="transparent"
            opacity={attrs.opacity ?? 1}
            rotation={attrs.rotation ?? 0}
            draggable
            onDragMove={onDragMoveFrame}
            onDragEnd={onDragEndFrame}
          />
        );
      default:
        return null;
    }
  };

  return <>{renderIcon()}</>;
};

export default SpecialIconItem;
