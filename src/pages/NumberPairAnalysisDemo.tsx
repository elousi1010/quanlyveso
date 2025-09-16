import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Numbers as NumbersIcon,
  Search as SearchIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

const NumberPairAnalysisDemo = () => {
  const [demoResults, setDemoResults] = useState<any[]>([]);

  const runDemo = () => {
    const examples = [
      {
        input: "123456789",
        description: "Dãy số liên tiếp từ 1-9",
        expectedPairs: ["12", "23", "34", "45", "56", "67", "78", "89"]
      },
      {
        input: "1122334455",
        description: "Dãy số có cặp lặp lại",
        expectedPairs: ["11", "12", "22", "23", "33", "34", "44", "45", "55"]
      },
      {
        input: "0123456789",
        description: "Dãy số từ 0-9 (10 chữ số)",
        expectedPairs: ["01", "12", "23", "34", "45", "56", "67", "78", "89"]
      },
      {
        input: "1111111111",
        description: "Dãy số toàn số 1",
        expectedPairs: ["11"]
      },
      {
        input: "12345678901234567890",
        description: "Dãy số dài 20 chữ số",
        expectedPairs: ["12", "23", "34", "45", "56", "67", "78", "89", "90", "01"]
      }
    ];

    const results = examples.map(example => {
      const number = example.input;
      const pairMap = new Map<string, { count: number; positions: number[] }>();

      // Tìm tất cả các cặp số liền kề
      for (let i = 0; i < number.length - 1; i++) {
        const pair = number.substring(i, i + 2);
        if (pairMap.has(pair)) {
          const existing = pairMap.get(pair)!;
          existing.count++;
          existing.positions.push(i);
        } else {
          pairMap.set(pair, { count: 1, positions: [i] });
        }
      }

      const pairs = Array.from(pairMap.entries()).map(([pair, data]) => ({
        pair,
        count: data.count,
        positions: data.positions,
      })).sort((a, b) => b.count - a.count);

      return {
        ...example,
        pairs,
        totalPairs: number.length - 1,
        uniquePairs: pairs.length,
        mostFrequent: pairs[0]?.pair || '',
        leastFrequent: pairs[pairs.length - 1]?.pair || '',
      };
    });

    setDemoResults(results);
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <NumbersIcon className="text-2xl sm:text-3xl" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Demo Phân tích cặp số</h1>
              <p className="text-sm sm:text-base text-indigo-100">Ví dụ minh họa cách hoạt động của hệ thống</p>
            </div>
          </div>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={runDemo}
            className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-4 py-2 rounded-lg"
          >
            Chạy Demo
          </Button>
        </div>
      </div>

      {/* Demo Results */}
      {demoResults.length > 0 && (
        <div className="space-y-6">
          {demoResults.map((result, index) => (
            <Card key={index} className="card">
              <div className="card-header">
                <Typography variant="h6" className="font-semibold text-gray-900">
                  Ví dụ {index + 1}: {result.description}
                </Typography>
              </div>
              <CardContent>
                <div className="space-y-4">
                  {/* Input */}
                  <div>
                    <Typography variant="subtitle2" className="font-medium text-gray-700 mb-2">
                      Dãy số đầu vào:
                    </Typography>
                    <Paper className="p-3 bg-gray-50">
                      <Typography variant="h6" className="font-mono text-center">
                        {result.input}
                      </Typography>
                    </Paper>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Typography variant="h6" className="font-bold text-blue-600">
                        {result.totalPairs}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        Tổng cặp số
                      </Typography>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Typography variant="h6" className="font-bold text-green-600">
                        {result.uniquePairs}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        Cặp duy nhất
                      </Typography>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <Typography variant="h6" className="font-bold text-yellow-600">
                        {result.mostFrequent}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        Nhiều nhất
                      </Typography>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <Typography variant="h6" className="font-bold text-red-600">
                        {result.leastFrequent}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        Ít nhất
                      </Typography>
                    </div>
                  </div>

                  {/* Pairs */}
                  <div>
                    <Typography variant="subtitle2" className="font-medium text-gray-700 mb-2">
                      Các cặp số tìm thấy:
                    </Typography>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                      {result.pairs.map((pair: any) => (
                        <Paper
                          key={pair.pair}
                          elevation={1}
                          className="p-2 text-center hover:shadow-md transition-shadow"
                        >
                          <Typography variant="h6" className="font-bold text-gray-900 mb-1">
                            {pair.pair}
                          </Typography>
                          <Typography variant="body2" className="text-gray-600 mb-1">
                            {pair.count} lần
                          </Typography>
                          <Chip
                            label={`Vị trí: ${pair.positions.join(', ')}`}
                            size="small"
                            color="primary"
                            className="text-xs"
                          />
                        </Paper>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Instructions */}
      <Card className="card">
        <div className="card-header">
          <Typography variant="h6" className="font-semibold text-gray-900">
            Cách hoạt động
          </Typography>
        </div>
        <CardContent>
          <List>
            <ListItem>
              <ListItemIcon>
                <NumbersIcon className="text-blue-500" />
              </ListItemIcon>
              <ListItemText
                primary="Tìm cặp số liền kề"
                secondary="Hệ thống quét dãy số từ trái sang phải, tìm tất cả các cặp số liền kề"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SearchIcon className="text-green-500" />
              </ListItemIcon>
              <ListItemText
                primary="Đếm số lần xuất hiện"
                secondary="Mỗi cặp số được đếm số lần xuất hiện và ghi nhận vị trí"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AssessmentIcon className="text-purple-500" />
              </ListItemIcon>
              <ListItemText
                primary="Phân tích kết quả"
                secondary="Hiển thị thống kê tổng quan và chi tiết từng cặp số"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </div>
  );
};

export default NumberPairAnalysisDemo;
