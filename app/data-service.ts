import { LogItem } from "@/models";


export const gocCapTau = (kcl: string, kcm: string, kcd="0") => {
  const kcl_value = Math.abs(parseFloat(kcl) - parseFloat(kcd))
  const kcm_value = Math.abs(parseFloat(kcm) - parseFloat(kcd))
  return '' + (Math.atan((kcl_value - kcm_value)/ 100) * (180 / Math.PI)).toFixed(2)
}

export const cal_vtt = (kcm, time, prev_data, kcd="0") => {
  /*
{
        id: key,
        name: name,
        voyn: voyn,
        time: new Date().toLocaleString().replace(',', ' '),
        vtt: parseFloat(`${speedTAU}`).toFixed(2), 
        vtg: parseFloat(speedWind).toFixed(2), 
        kcl: parseFloat(distanceLAI).toFixed(2),
        kcm: parseFloat(distanceMUI).toFixed(2)
      }
  */
    if (!prev_data || !time || !kcm) return "-"
    const kcd_value = parseFloat(kcd)
    const data = JSON.parse(prev_data);
    const dkcm =  Math.abs(parseFloat(data.kcm) - Math.abs(parseFloat(kcm) - kcd_value));
    const dt = (time - data.time) / (60 * 1000);
    return parseFloat(`${(dkcm / dt)}`).toFixed(2)
}


export const genCSVDataString = (logs: LogItem[]) => {
    const csvString = [
      [
        "Tên Tàu",
        "VOY No", 
        "Thời gian đo",
        "Tốc độ lái tàu",
        "Tốc độ gió",
        "Cảnh báo tốc độ gió", 
        "Khoảng cách lái tàu đo đươc", 
        "Khoảng cách mũi",
        "Góc cập cầu"], // Specify your headers here
      ...logs.map(item => [
        item.name,
        item.voyn,
        item.time,
        (+item.vtt).toFixed(2),
        (+item.vtg).toFixed(2),
        (parseFloat(item.vtg) > 13.8)? "CẢNH BÁO" : "BÌNH THƯỜNG",
        item.kcl,
        item.kcm,
        gocCapTau(item.kcl, item.kcm)])
    ]
    .map(row => row.join(","))
    .join("\n");
    return csvString;
}

// export type LogItem = {
//     id: number;   
//     name: string;
//     voyn: string;
//     time: string;
//     vtt: string;
//     vtg: string;
//     kcl: string;
//     kcm: string;
//   };


// export const 