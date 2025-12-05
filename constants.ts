
import { NewsItem } from './types';

export const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: '网传“人社保卡必须在规定时间内换发”系谣言',
    source: '中国互联网联合辟谣平台',
    status: 'debunked',
    timestamp: '10分钟前',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    // Using internal search of the platform to ensure result relevance and no 404
    url: 'http://so.piyao.org.cn/search/search?page=1&channelid=274971&searchword=社保卡'
  },
  {
    id: '2',
    title: '官方通报：多地暴雨预警升级，应急响应启动',
    source: '今日头条',
    status: 'verified',
    timestamp: '30分钟前',
    imageUrl: 'https://images.unsplash.com/photo-1514632595-4944383f27f4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    url: 'https://so.toutiao.com/search?dvpf=pc&keyword=暴雨预警应急响应'
  },
  {
    id: '3',
    title: '微博热搜：我国成功发射一颗新卫星',
    source: '微博',
    status: 'verified',
    timestamp: '1小时前',
    imageUrl: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    url: 'https://s.weibo.com/weibo?q=%23我国成功发射%23'
  },
  {
    id: '4',
    title: '谣言：长期喝纯净水会导致钙流失',
    source: '中国互联网联合辟谣平台',
    status: 'debunked',
    timestamp: '2小时前',
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    url: 'http://so.piyao.org.cn/search/search?page=1&channelid=274971&searchword=纯净水+钙流失'
  },
  {
    id: '5',
    title: '热点：新能源汽车下乡政策最新解读',
    source: '今日头条',
    status: 'verified',
    timestamp: '3小时前',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    url: 'https://so.toutiao.com/search?keyword=新能源汽车下乡'
  }
];

export const INITIAL_GRAPH_DATA = {
  nodes: [],
  links: []
};
