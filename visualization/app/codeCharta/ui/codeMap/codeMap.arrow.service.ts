import { Node, EdgeVisibility } from "../../codeCharta.model"
import { ThreeSceneService } from "./threeViewer/threeSceneService"
import { Edge } from "../../codeCharta.model"
import { ArrowHelper, BufferGeometry, CubicBezierCurve3, Line, LineBasicMaterial, Object3D, Vector3 } from "three"
import { BuildingHoveredSubscriber, CodeMapMouseEventService, BuildingUnhoveredSubscriber } from "./codeMap.mouseEvent.service"
import { IRootScopeService } from "angular"
import { ColorConverter } from "../../util/color/colorConverter"
import { CodeMapBuilding } from "./rendering/codeMapBuilding"
import { StoreService } from "../../state/store.service"

export class CodeMapArrowService implements BuildingHoveredSubscriber, BuildingUnhoveredSubscriber {
	private VERTICES_PER_LINE = 5
	private map: Map<String, Node>
	private arrows: Object3D[]
	private isHovered: boolean = false
	private hoveredNode: Node

	constructor(private $rootScope: IRootScopeService, private storeService: StoreService, private threeSceneService: ThreeSceneService) {
		this.arrows = new Array<Object3D>()
		CodeMapMouseEventService.subscribeToBuildingHovered(this.$rootScope, this)
		CodeMapMouseEventService.subscribeToBuildingUnhovered(this.$rootScope, this)
	}

	public onBuildingHovered(hoveredBuilding: CodeMapBuilding) {
		const state = this.storeService.getState()
		if (state.dynamicSettings.edgeMetric !== "None" && !hoveredBuilding.node.flat) {
			this.isHovered = true
			this.hoveredNode = hoveredBuilding.node
			this.clearArrows()
			this.showEdgesOfHoveredBuilding(hoveredBuilding.node, state.fileSettings.edges)
		}
		this.scale()
	}

	public onBuildingUnhovered() {
		const state = this.storeService.getState()
		if (state.dynamicSettings.edgeMetric !== "None") {
			this.isHovered = false
			this.clearArrows()
			this.addEdgeArrows(null, state.fileSettings.edges.filter(x => x.visible != EdgeVisibility.none))
		}
		this.scale()
	}

	public clearArrows() {
		this.arrows = []
		while (this.threeSceneService.edgeArrows.children.length > 0) {
			this.threeSceneService.edgeArrows.children.pop()
		}
	}

	public addEdgeArrows(nodes: Node[], edges: Edge[]) {
		if (nodes) {
			this.map = this.getNodesAsMap(nodes)
		}

		for (const edge of edges) {
			const originNode: Node = this.map.get(edge.fromNodeName)
			const targetNode: Node = this.map.get(edge.toNodeName)

			if (originNode && targetNode && edge.visible != EdgeVisibility.none && edge.visible) {
				this.addArrow(targetNode, originNode, edge.visible)
			}
		}
	}

	private showEdgesOfHoveredBuilding(hoveredNode: Node, edges: Edge[]) {
		for (const edge of edges) {
			const originNode: Node = this.map.get(edge.fromNodeName)
			const targetNode: Node = this.map.get(edge.toNodeName)

			if (originNode && targetNode && (originNode.path === hoveredNode.path || targetNode.path === hoveredNode.path)) {
				this.addArrow(targetNode, originNode)
			}
		}
		this.threeSceneService.highlightBuildings()
	}

	public addArrow(arrowTargetNode: Node, arrowOriginNode: Node, edgeVisibility?: EdgeVisibility): void {
		const state = this.storeService.getState()
		const curveScale = 100 * state.appSettings.edgeHeight

		if (
			arrowTargetNode.attributes &&
			arrowTargetNode.attributes[this.storeService.getState().dynamicSettings.heightMetric] &&
			arrowOriginNode.attributes &&
			arrowOriginNode.attributes[this.storeService.getState().dynamicSettings.heightMetric]
		) {
			const bezierPoint2 = arrowOriginNode.outgoingEdgePoint.clone()
			const bezierPoint3 = arrowTargetNode.incomingEdgePoint.clone()

			const arrowHeight = Math.max(bezierPoint2.y + arrowTargetNode.height, bezierPoint3.y + 1) + curveScale
			bezierPoint2.setY(arrowHeight)
			bezierPoint3.setY(arrowHeight)

			const curve = new CubicBezierCurve3(
				arrowOriginNode.outgoingEdgePoint,
				bezierPoint2,
				bezierPoint3,
				arrowTargetNode.incomingEdgePoint
			)

			if (this.isHovered) {
				this.hoveredMode(curve, arrowOriginNode, arrowTargetNode)
			} else {
				this.previewMode(curve, edgeVisibility)
			}
		}
	}

	private hoveredMode(bezier: CubicBezierCurve3, arrowOriginNode: Node, arrowTargetNode: Node, bezierPoints: number = 50) {
		const points = bezier.getPoints(bezierPoints)
		if (this.hoveredNode.path === arrowOriginNode.path) {
			const building: CodeMapBuilding = this.threeSceneService
				.getMapMesh()
				.getMeshDescription()
				.getBuildingByPath(arrowTargetNode.path)
			this.threeSceneService.addBuildingToHighlightingList(building)

			const curveObject = this.buildLine(
				points,
				ColorConverter.convertHexToNumber(this.storeService.getState().appSettings.mapColors.outgoingEdge)
			)
			curveObject.add(this.buildArrow(points))

			this.threeSceneService.edgeArrows.add(curveObject)
			this.arrows.push(curveObject)
		} else {
			const building: CodeMapBuilding = this.threeSceneService
				.getMapMesh()
				.getMeshDescription()
				.getBuildingByPath(arrowOriginNode.path)
			this.threeSceneService.addBuildingToHighlightingList(building)
			const curveObject = this.buildLine(
				points,
				ColorConverter.convertHexToNumber(this.storeService.getState().appSettings.mapColors.incomingEdge)
			)
			curveObject.add(this.buildArrow(points))

			this.threeSceneService.edgeArrows.add(curveObject)
			this.arrows.push(curveObject)
		}
	}

	private previewMode(curve, edgeVisibility: EdgeVisibility) {
		if (edgeVisibility === EdgeVisibility.both || edgeVisibility === EdgeVisibility.from) {
			const outgoingArrow: Object3D = this.makeArrowFromBezier(curve, false)
			this.threeSceneService.edgeArrows.add(outgoingArrow)
			this.arrows.push(outgoingArrow)
		}

		if (edgeVisibility === EdgeVisibility.both || edgeVisibility === EdgeVisibility.to) {
			const incomingArrow: Object3D = this.makeArrowFromBezier(curve, true)
			this.threeSceneService.edgeArrows.add(incomingArrow)
			this.arrows.push(incomingArrow)
		}
	}

	public scale() {
		const scaling = this.storeService.getState().appSettings.scaling
		for (const arrow of this.arrows) {
			arrow.scale.x = scaling.x
			arrow.scale.y = scaling.y
			arrow.scale.z = scaling.z
		}
	}

	private getNodesAsMap(nodes: Node[]): Map<string, Node> {
		const map = new Map<string, Node>()
		nodes.forEach(node => map.set(node.path, node))
		return map
	}

	private makeArrowFromBezier(bezier: CubicBezierCurve3, incoming: boolean, bezierPoints: number = 50) {
		const points = bezier.getPoints(bezierPoints)
		let pointsPrevies: Vector3[]
		let arrowColor: string

		if (incoming) {
			pointsPrevies = points.slice(bezierPoints + 1 - this.VERTICES_PER_LINE)
			arrowColor = this.storeService.getState().appSettings.mapColors.incomingEdge
		} else {
			pointsPrevies = points
				.reverse()
				.slice(bezierPoints + 1 - this.VERTICES_PER_LINE)
				.reverse()
			arrowColor = this.storeService.getState().appSettings.mapColors.outgoingEdge
		}

		return this.buildEdge(pointsPrevies, ColorConverter.convertHexToNumber(arrowColor))
	}

	private buildEdge(points: Vector3[], color: number): Object3D {
		const curveObject = this.buildLine(points, color)
		curveObject.add(this.buildArrow(points))

		return curveObject
	}

	private buildLine(points: Vector3[], color: number = 0) {
		const geometry = new BufferGeometry()
		geometry.setFromPoints(points)

		const material = new LineBasicMaterial({ color, linewidth: 1 })
		return new Line(geometry, material)
	}

	private buildArrow(points: Vector3[], ARROW_COLOR: number = 0, headLength: number = 10, headWidth: number = 10) {
		const dir = points[points.length - 1]
			.clone()
			.sub(points[points.length - 2].clone())
			.normalize()

		const origin = points[points.length - 1].clone()
		if (dir.y < 0) {
			origin.y += headLength + 1
		}
		return new ArrowHelper(dir, origin, headLength + 1, ARROW_COLOR, headLength, headWidth)
	}
}
