import { SearchBar } from 'antd-mobile';
import React, { useState, useEffect, memo, useRef } from 'react';
import styles from './index.module.scss'
import iconSearch from "@/assets/iconSearch.png";
import { getFirstChar } from '@/utils';
const letterArr = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)); // 生成 A-Z 字母数组
import { IndexBar, List } from 'antd-mobile';
import { CheckOutline } from 'antd-mobile-icons';
function PlaceSelect(props: any) {
  const {businessId, handleSelectPlace} = props
  const [searchVal, setSearchVal] = useState(""); // 搜索内容
  const [unitList, setUnitList] = useState([]); // 常用单位列表
  const headerRef = useRef<any>(null);
  const placeSelectRef = useRef<any>(null);
  const contentRef = useRef<any>(null);
  const unitAllList = useRef<any>([]);

  useEffect(() => {
    getUnitData();
  }, []);
  useEffect(() => {
    if (headerRef.current && contentRef.current) {
      const headerH = window.getComputedStyle(headerRef.current).height
      contentRef.current.style.marginTop = headerH;
      contentRef.current.style.height = `calc(100% - ${headerH})`;
    }
  }, []);
  // 获取常用单位列表
  const getUnitData = () => {
    window.$api.getUnitList().then((res: any) => {
      const {data} = res
      handleUnitData(data || []);
    });
  };
  const handleUnitData = (data: any[]) => {
    const arr = data.map((item: any) => {
      item.firstChar = getFirstChar(item.name)
      return item
    })
    letterArr.forEach(letter => {
      const cityItems = arr.filter(item => 
        item.firstChar === letter
      );
      if (cityItems.length) {
        unitAllList.current.push({ title: letter, items: cityItems });
      }
    });
    setUnitList(unitAllList.current)
  }
  // 处理选择
  const handleSelect = (item: any) => {
    if (!businessId) {
      handleSelectPlace(item);
      return
    }
    if (item.businessId == businessId) {
      handleSelectPlace({
        name: '',
        businessId: '',
      });
    } else {
      handleSelectPlace(item);
    }
  }
  // 处理搜索
  const handleSearch = (val: string = searchVal) => {
    const arrUnit = JSON.parse(JSON.stringify(unitAllList.current))
    if (val) {
      const arrT = arrUnit.filter((item: any) => {
        item.items = item.items.filter((e: any) => e.name.includes(val))
        return item.items.length
      })
      setUnitList(arrT)
    } else {
      setUnitList(unitAllList.current)
      // getUnitData();
    }
  };
  return (
    <div className={styles.placeSelect} ref={placeSelectRef}>
      <div className={styles.placeSelect_header} ref={headerRef}>
        <p>选择目的地</p>
        <div className={styles.placeSelect_header_search}>
          <SearchBar
              style={{
                '--background': '#fff',
                '--height': '24px',
                'fontSize': '10px'
              }}
            onChange={(val) => {
              setSearchVal(val);
            }}
            onSearch={(val) => {
              handleSearch()
            }}
            searchIcon={<img width={24} height={24} src={iconSearch} />}
            placeholder="请输入医院名称查找"
          />
          <div className={styles.placeSelect_header_search_btn} onClick={() => handleSearch()}>
            <span>搜索</span>
          </div>
        </div>
      </div>
      <div className={styles.placeSelect_content} ref={contentRef}>
        <IndexBar>
          {unitList.map(group => (
            <IndexBar.Panel
              key={group.title}
              index={group.title}        // 右侧索引标识
              title={`${group.title}`}   // 左侧分组标题
            >
              <List>
                {group.items.map(city => (
                  <List.Item
                    arrowIcon={false}
                    key={city.id} 
                    onClick={() => handleSelect(city)} // 点击回调
                  >
                    <div className={styles.placeSelect_content_item}>
                      <p>{city.name}</p>
                      {
                        businessId === city.businessId && <CheckOutline style={{ fontSize: '20px', color: "#1890ff" }} />
                      }
                    </div>
                  </List.Item>
                ))}
              </List>
            </IndexBar.Panel>
          ))}
        </IndexBar>
        
      </div>
    </div>
  )
}
export default memo(PlaceSelect)