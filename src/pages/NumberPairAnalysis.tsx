import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Numbers as NumbersIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

interface NumberPair {
  pair: string;
  count: number;
  positions: number[];
}

const NumberPairAnalysis = () => {
  const [inputNumber, setInputNumber] = useState('');
  const [pairs, setPairs] = useState<NumberPair[]>([]);
  const [error, setError] = useState('');
  const [analysisResult, setAnalysisResult] = useState({
    totalPairs: 0,
    uniquePairs: 0,
    mostFrequent: '',
    leastFrequent: '',
  });

  const generateAllPairs = () => {
    const allPairs: string[] = [];
    for (let i = 0; i <= 9; i++) {
      for (let j = 0; j <= 9; j++) {
        allPairs.push(`${i}${j}`);
      }
    }
    return allPairs;
  };

  const analyzeNumber = () => {
    if (!inputNumber.trim()) {
      setError('Vui lòng nhập dãy số');
      return;
    }

    // Kiểm tra chỉ chứa số
    if (!/^\d+$/.test(inputNumber)) {
      setError('Dãy số chỉ được chứa các chữ số từ 0-9');
      return;
    }

    setError('');
    const number = inputNumber.trim();
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

    // Chuyển đổi thành array và sắp xếp
    const pairArray: NumberPair[] = Array.from(pairMap.entries()).map(([pair, data]) => ({
      pair,
      count: data.count,
      positions: data.positions,
    })).sort((a, b) => b.count - a.count);

    setPairs(pairArray);

    // Tính toán kết quả phân tích
    const totalPairs = number.length - 1;
    const uniquePairs = pairArray.length;
    const mostFrequent = pairArray[0]?.pair || '';
    const leastFrequent = pairArray[pairArray.length - 1]?.pair || '';

    setAnalysisResult({
      totalPairs,
      uniquePairs,
      mostFrequent,
      leastFrequent,
    });
  };

  const clearAnalysis = () => {
    setInputNumber('');
    setPairs([]);
    setError('');
    setAnalysisResult({
      totalPairs: 0,
      uniquePairs: 0,
      mostFrequent: '',
      leastFrequent: '',
    });
  };

  const getPairColor = (count: number, maxCount: number) => {
    if (count === maxCount) return 'success';
    if (count >= maxCount * 0.7) return 'warning';
    return 'default';
  };

  const allPossiblePairs = generateAllPairs();

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <NumbersIcon className="text-2xl sm:text-3xl" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Phân tích cặp số</h1>
              <p className="text-sm sm:text-base text-purple-100">Tìm và phân tích các cặp số trong dãy số</p>
            </div>
          </div>
          <Button
            variant="contained"
            startIcon={<ClearIcon />}
            onClick={clearAnalysis}
            className="bg-white text-purple-600 hover:bg-purple-50 font-semibold px-4 py-2 rounded-lg"
          >
            Xóa
          </Button>
        </div>
      </div>

      {/* Input Section */}
      <Card className="card">
        <div className="card-header">
          <Typography variant="h6" className="font-semibold text-gray-900">
            Nhập dãy số
          </Typography>
        </div>
        <CardContent>
          <div className="space-y-4">
            <TextField
              fullWidth
              label="Dãy số cần phân tích"
              placeholder="Ví dụ: 123456789"
              value={inputNumber}
              onChange={(e) => setInputNumber(e.target.value)}
              error={!!error}
              helperText={error || "Nhập dãy số để tìm các cặp số liền kề"}
              variant="outlined"
              className="mb-4"
            />
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={analyzeNumber}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold"
              disabled={!inputNumber.trim()}
            >
              Phân tích
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {pairs.length > 0 && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="stat-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                      Tổng cặp số
                    </Typography>
                    <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                      {analysisResult.totalPairs}
                    </Typography>
                  </div>
                  <NumbersIcon className="text-blue-500 text-2xl sm:text-3xl" />
                </div>
              </CardContent>
            </Card>
            <Card className="stat-card-success">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                      Cặp số duy nhất
                    </Typography>
                    <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                      {analysisResult.uniquePairs}
                    </Typography>
                  </div>
                  <TrendingUpIcon className="text-green-500 text-2xl sm:text-3xl" />
                </div>
              </CardContent>
            </Card>
            <Card className="stat-card-warning">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                      Xuất hiện nhiều nhất
                    </Typography>
                    <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                      {analysisResult.mostFrequent}
                    </Typography>
                  </div>
                  <AssessmentIcon className="text-yellow-500 text-2xl sm:text-3xl" />
                </div>
              </CardContent>
            </Card>
            <Card className="stat-card-error">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                      Xuất hiện ít nhất
                    </Typography>
                    <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                      {analysisResult.leastFrequent}
                    </Typography>
                  </div>
                  <NumbersIcon className="text-red-500 text-2xl sm:text-3xl" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Found Pairs */}
          <Card className="card">
            <div className="card-header">
              <Typography variant="h6" className="font-semibold text-gray-900">
                Các cặp số tìm thấy ({pairs.length} cặp)
              </Typography>
            </div>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {pairs.map((pair) => (
                  <Paper
                    key={pair.pair}
                    elevation={2}
                    className="p-3 text-center hover:shadow-md transition-shadow"
                  >
                    <Typography variant="h6" className="font-bold text-gray-900 mb-1">
                      {pair.pair}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 mb-2">
                      {pair.count} lần
                    </Typography>
                    <Chip
                      label={`Vị trí: ${pair.positions.join(', ')}`}
                      size="small"
                      color={getPairColor(pair.count, pairs[0]?.count || 1)}
                      className="text-xs"
                    />
                  </Paper>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* All Possible Pairs */}
          <Card className="card">
            <div className="card-header">
              <Typography variant="h6" className="font-semibold text-gray-900">
                Tất cả cặp số có thể (100 cặp)
              </Typography>
            </div>
            <CardContent>
              <div className="grid grid-cols-10 gap-1">
                {allPossiblePairs.map((pair) => {
                  const found = pairs.find(p => p.pair === pair);
                  return (
                    <Chip
                      key={pair}
                      label={pair}
                      size="small"
                      color={found ? 'primary' : 'default'}
                      variant={found ? 'filled' : 'outlined'}
                      className="text-xs"
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Instructions */}
      <Card className="card">
        <div className="card-header">
          <Typography variant="h6" className="font-semibold text-gray-900">
            Hướng dẫn sử dụng
          </Typography>
        </div>
        <CardContent>
          <List>
            <ListItem>
              <ListItemIcon>
                <NumbersIcon className="text-blue-500" />
              </ListItemIcon>
              <ListItemText
                primary="Nhập dãy số"
                secondary="Nhập dãy số bất kỳ (chỉ chứa số từ 0-9) để phân tích"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SearchIcon className="text-green-500" />
              </ListItemIcon>
              <ListItemText
                primary="Phân tích cặp số"
                secondary="Hệ thống sẽ tìm tất cả các cặp số liền kề trong dãy số"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AssessmentIcon className="text-purple-500" />
              </ListItemIcon>
              <ListItemText
                primary="Xem kết quả"
                secondary="Hiển thị số lần xuất hiện và vị trí của từng cặp số"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </div>
  );
};

export default NumberPairAnalysis;
