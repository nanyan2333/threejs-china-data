/**
 * 中国行政区划 adcode 到省份名称的映射
 * 基于国家统计局 GB/T 2260 标准
 */
const ADCODE_TO_PROVINCE: Record<string, string> = {
	// 华北地区
	"110000": "北京市",
	"120000": "天津市",
	"130000": "河北省",
	"140000": "山西省",
	"150000": "内蒙古自治区",

	// 东北地区
	"210000": "辽宁省",
	"220000": "吉林省",
	"230000": "黑龙江省",

	// 华东地区
	"310000": "上海市",
	"320000": "江苏省",
	"330000": "浙江省",
	"340000": "安徽省",
	"350000": "福建省",
	"360000": "江西省",
	"370000": "山东省",

	// 中南地区
	"410000": "河南省",
	"420000": "湖北省",
	"430000": "湖南省",
	"440000": "广东省",
	"450000": "广西壮族自治区",
	"460000": "海南省",

	// 西南地区
	"500000": "重庆市",
	"510000": "四川省",
	"520000": "贵州省",
	"530000": "云南省",
	"540000": "西藏自治区",

	// 西北地区
	"610000": "陕西省",
	"620000": "甘肃省",
	"630000": "青海省",
	"640000": "宁夏回族自治区",
	"650000": "新疆维吾尔自治区",

	// 特别说明：港澳台地区
	"710000": "台湾省",
	"810000": "香港特别行政区",
	"820000": "澳门特别行政区",
}

/**
 * 将地理地图数据的 adcode 映射成中国大陆的省名
 * @param adcode - 行政区划代码，如 '110000'
 * @param options - 可选配置
 * @param options.includeSpecialRegions - 是否包含港澳台地区，默认为 true
 * @param options.returnDefault - 当未找到对应省份时返回的默认值，默认为 adcode 本身
 * @returns 对应的省份名称，如果未找到则返回默认值
 *
 * @example
 * ```typescript
 * getProvinceNameByAdcode('110000') // 返回: '北京市'
 * getProvinceNameByAdcode('440000') // 返回: '广东省'
 * getProvinceNameByAdcode('999999') // 返回: '999999'
 * getProvinceNameByAdcode('999999', { returnDefault: '未知地区' }) // 返回: '未知地区'
 * ```
 */
export function getProvinceNameByAdcode(
	adcode: string | number,
	options?: {
		includeSpecialRegions?: boolean
		returnDefault?: string
	}
): string {
	const { includeSpecialRegions = true, returnDefault } = options || {}

	// 将数字转换为字符串
	const codeStr = String(adcode)

	// 验证 adcode 格式（6位数字）
	if (!/^\d{6}$/.test(codeStr)) {
		return returnDefault ?? codeStr
	}

	// 如果不包含港澳台地区，且是港澳台代码，返回默认值
	if (
		!includeSpecialRegions &&
		["710000", "810000", "820000"].includes(codeStr)
	) {
		return returnDefault ?? codeStr
	}

	// 查找对应的省份名称
	const provinceName = ADCODE_TO_PROVINCE[codeStr]

	// 如果找到则返回，否则返回默认值
	return provinceName ?? returnDefault ?? codeStr
}

/**
 * 获取所有省份的 adcode 列表
 * @param options - 可选配置
 * @param options.includeSpecialRegions - 是否包含港澳台地区，默认为 true
 * @returns 省份 adcode 数组
 */
export function getAllProvinceAdcodes(options?: {
	includeSpecialRegions?: boolean
}): string[] {
	const { includeSpecialRegions = true } = options || {}

	const adcodes = Object.keys(ADCODE_TO_PROVINCE)

	if (!includeSpecialRegions) {
		return adcodes.filter(
			(code) => !["710000", "810000", "820000"].includes(code)
		)
	}

	return adcodes
}

/**
 * 反向映射：根据省份名称获取 adcode
 * @param provinceName - 省份名称，如 '北京市'
 * @returns 对应的 adcode，如果未找到则返回 null
 *
 * @example
 * ```typescript
 * getAdcodeByProvinceName('北京市') // 返回: '110000'
 * getAdcodeByProvinceName('广东省') // 返回: '440000'
 * getAdcodeByProvinceName('未知省份') // 返回: null
 * ```
 */
export function getAdcodeByProvinceName(provinceName: string): string | null {
	const entries = Object.entries(ADCODE_TO_PROVINCE)
	const found = entries.find(([_, name]) => name === provinceName)
	return found ? found[0] : null
}

/**
 * 检查给定的 adcode 是否为中国大陆省份代码
 * @param adcode - 行政区划代码
 * @param options - 可选配置
 * @param options.includeSpecialRegions - 是否包含港澳台地区，默认为 true
 * @returns 是否为有效省份代码
 */
export function isValidProvinceAdcode(
	adcode: string | number,
	options?: {
		includeSpecialRegions?: boolean
	}
): boolean {
	const { includeSpecialRegions = true } = options || {}
	const codeStr = String(adcode)

	if (!/^\d{6}$/.test(codeStr)) {
		return false
	}

	if (
		!includeSpecialRegions &&
		["710000", "810000", "820000"].includes(codeStr)
	) {
		return false
	}

	return codeStr in ADCODE_TO_PROVINCE
}

// 默认导出主要函数
export default getProvinceNameByAdcode
