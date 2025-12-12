import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import Map3D, { ProjectionFnParamType } from "./map3d"
import { GeoJsonType, chartData, ApiData } from "./map3d/typed"
import getProvinceNameByAdcode from "./utils/adcodeMap"

// 地图放大倍率
// const MapScale: any = {
// 	province: 100,
// 	city: 200,
// 	district: 300,
// }

const url = "http://121.41.14.73/api/data/"
function App() {
	const [geoJson, setGeoJson] = useState<GeoJsonType>()
	const [mapAdCode, setMapAdCode] = useState<number>(100000)
	const [projectionFnParam, setProjectionFnParam] =
		useState<ProjectionFnParamType>({
			center: [104.0, 37.5],
			scale: 40,
		})
	const [chartData, setChartData] = useState<chartData[]>([])

	useEffect(() => {
		queryMapData(mapAdCode) // 默认的中国adcode码
	}, [mapAdCode])

	// 请求地图数据
	const queryMapData = useCallback(async (code: number) => {
		const response = await axios.get(
			`https://geo.datav.aliyun.com/areas_v3/bound/${code}_full.json`
		)
		const { data } = response
		setGeoJson(data)
	}, [])

	// 双击事件
	const dblClickFn = async (customProperties: any) => {
		// setMapAdCode(customProperties.adcode);
		// setProjectionFnParam({
		//   center: customProperties.centroid,
		//   scale: MapScale[customProperties.level],
		// });
		const provinceName = getProvinceNameByAdcode(customProperties.adcode)
		const data: ApiData = (await axios.get(url + provinceName)).data
		const chartDatas: chartData[] = []
		for (const [key, value] of Object.entries(data)) {
			const _time: string[] = []
			const _value: number[] = []
			value.map((item) => {
				const _item = Object.values(item)
				_time.push(_item[0])
				_value.push(parseFloat(_item[1]))
			})

			chartDatas.push({
				name: key,
				time: _time,
				value: _value,
			})
		}
		setChartData(chartDatas)
	}

	return (
		<>
			{geoJson && (
				<Map3D
					geoJson={geoJson}
					dblClickFn={dblClickFn}
					projectionFnParam={projectionFnParam}
          chartData={chartData}
				/>
			)}
		</>
	)
}

export default App
