"""
Lab Report Analysis System
Analyzes medical lab reports and provides desi home remedy suggestions
"""

import re
import json
from typing import Dict, List, Tuple, Optional
from datetime import datetime


class LabReportAnalyzer:
    """Analyzes lab reports and provides desi remedy suggestions"""
    
    def __init__(self):
        self.lab_reference_ranges = self._load_reference_ranges()
        self.remedy_knowledge_base = self._load_remedy_knowledge()
    
    def _load_reference_ranges(self) -> Dict:
        """Load normal reference ranges for common lab tests"""
        return {
            'hemoglobin': {'normal': (12.0, 16.0), 'unit': 'g/dL', 'gender_specific': True, 'male': (13.5, 17.5), 'female': (12.0, 15.5)},
            'hb': {'normal': (12.0, 16.0), 'unit': 'g/dL', 'gender_specific': True, 'male': (13.5, 17.5), 'female': (12.0, 15.5)},
            'rbc': {'normal': (4.5, 5.5), 'unit': 'million/μL'},
            'rbc count': {'normal': (3.8, 4.8), 'unit': 'millions/cmm'},
            'haemoglobin': {'normal': (12.0, 16.0), 'unit': 'gm/dl', 'gender_specific': True, 'male': (13.5, 17.5), 'female': (12.0, 15.5)},
            'hb': {'normal': (12.0, 16.0), 'unit': 'gm/dl', 'gender_specific': True, 'male': (13.5, 17.5), 'female': (12.0, 15.5)},
            'pcv': {'normal': (36, 46), 'unit': '%', 'gender_specific': True, 'male': (40, 50), 'female': (36, 46)},
            'hematocrit': {'normal': (36, 46), 'unit': '%', 'gender_specific': True, 'male': (40, 50), 'female': (36, 46)},
            'mcv': {'normal': (83, 101), 'unit': 'fL'},
            'mch': {'normal': (27, 32), 'unit': 'pg'},
            'mchc': {'normal': (31.5, 34.5), 'unit': 'g/dL'},
            'rdw': {'normal': (11.6, 14.0), 'unit': '%'},
            'mpv': {'normal': (6, 9), 'unit': 'fL'},
            'pdw': {'normal': (11, 18), 'unit': '%'},
            'neutrophil': {'normal': (40, 80), 'unit': '%'},
            'lymphocytes': {'normal': (20, 40), 'unit': '%'},
            'eosinophils': {'normal': (1, 6), 'unit': '%'},
            'monocytes': {'normal': (2, 10), 'unit': '%'},
            'basophils': {'normal': (0, 1), 'unit': '%'},
            'tlc': {'normal': (4000, 11000), 'unit': '/cumm'},
            'wbc': {'normal': (4000, 11000), 'unit': '/μL'},
            'platelet': {'normal': (150000, 450000), 'unit': '/μL'},
            'platelets': {'normal': (150000, 450000), 'unit': '/μL'},
            'vitamin d': {'normal': (30, 100), 'unit': 'ng/mL'},
            'vitamin d3': {'normal': (30, 100), 'unit': 'ng/mL'},
            'calcium': {'normal': (8.5, 10.5), 'unit': 'mg/dL'},
            'vitamin b12': {'normal': (200, 900), 'unit': 'pg/mL'},
            'vitamin b 12': {'normal': (200, 900), 'unit': 'pg/mL'},
            'iron': {'normal': (60, 170), 'unit': 'μg/dL'},
            'ferritin': {'normal': (15, 200), 'unit': 'ng/mL'},
            'tsh': {'normal': (0.4, 4.0), 'unit': 'mIU/L'},
            't3': {'normal': (80, 200), 'unit': 'ng/dL'},
            't4': {'normal': (5, 12), 'unit': 'μg/dL'},
            'cholesterol': {'normal': (0, 200), 'unit': 'mg/dL'},
            'hdl': {'normal': (40, 60), 'unit': 'mg/dL'},
            'ldl': {'normal': (0, 100), 'unit': 'mg/dL'},
            'triglycerides': {'normal': (0, 150), 'unit': 'mg/dL'},
            'blood sugar': {'normal': (70, 100), 'unit': 'mg/dL'},
            'glucose': {'normal': (70, 100), 'unit': 'mg/dL', 'fasting': (70, 100), 'random': (70, 140)},
            'creatinine': {'normal': (0.6, 1.2), 'unit': 'mg/dL'},
            'urea': {'normal': (7, 20), 'unit': 'mg/dL'},
            'bilirubin': {'normal': (0.1, 1.2), 'unit': 'mg/dL'},
            'sgot': {'normal': (10, 40), 'unit': 'U/L'},
            'sgpt': {'normal': (10, 40), 'unit': 'U/L'},
            'alt': {'normal': (10, 40), 'unit': 'U/L'},
            'ast': {'normal': (10, 40), 'unit': 'U/L'},
        }
    
    def _load_remedy_knowledge(self) -> Dict:
        """Load desi remedy knowledge base for lab abnormalities"""
        return {
            'hemoglobin': {
                'low': {
                    'meaning': 'Body me lahu kam ban raha hai, energy kam ho sakti hai.',
                    'remedies': [
                        'Roz 1 glass anaar ka juice',
                        'Chukandar + gajar ka salad',
                        'Palak / bathua / leafy greens',
                        'Gur (jaggery) ka paani',
                        'Black raisins (kishmish) pani me bhigo kar'
                    ],
                    'doctor_note': 'Agar weakness bahut zyada ho toh checkup karwa lena.'
                },
                'high': {
                    'meaning': 'Body me lahu zyada ban raha hai. Yeh polycythemia ka sign ho sakta hai.',
                    'remedies': [
                        'Zyada pani piyein',
                        'Regular exercise karein',
                        'Smoking avoid karein'
                    ],
                    'doctor_note': 'Please consult doctor for proper evaluation.'
                }
            },
            'vitamin d': {
                'low': {
                    'meaning': 'Body me Vitamin D ki kami hai. Isse bones kamzor ho sakte hain, pain ho sakta hai.',
                    'remedies': [
                        'Roz subah 15-20 minutes dhoop me baithiye (sunlight)',
                        'Mushrooms khayein (sun-dried)',
                        'Egg yolk khayein',
                        'Fatty fish (if non-veg)',
                        'Fortified milk piyein'
                    ],
                    'doctor_note': 'Agar pain bahut ho ya bones me problem ho toh doctor se consult karein.'
                }
            },
            'calcium': {
                'low': {
                    'meaning': 'Body me calcium kam hai. Isse bones aur teeth kamzor ho sakte hain.',
                    'remedies': [
                        'Roz 2 glass doodh piyein',
                        'Curd (dahi) khayein',
                        'Ragi (finger millet) khayein',
                        'Sesame seeds (til) khayein',
                        'Green leafy vegetables khayein',
                        'Almonds (badam) khayein'
                    ],
                    'doctor_note': 'Agar bones me pain ho ya teeth me problem ho toh doctor se checkup karwa lena.'
                }
            },
            'vitamin b12': {
                'low': {
                    'meaning': 'Vitamin B12 ki kami hai. Isse weakness, memory issues, aur tingling ho sakti hai.',
                    'remedies': [
                        'Dairy products: doodh, dahi, paneer',
                        'Eggs khayein',
                        'Fortified cereals',
                        'If non-veg: fish, chicken'
                    ],
                    'doctor_note': 'Agar tingling ya numbness ho toh doctor se consult karein.'
                }
            },
            'iron': {
                'low': {
                    'meaning': 'Body me iron kam hai. Isse anemia ho sakta hai, weakness ho sakti hai.',
                    'remedies': [
                        'Chukandar (beetroot) ka juice',
                        'Palak aur leafy greens',
                        'Dates (khajur) aur dry fruits',
                        'Jaggery (gur) ka paani',
                        'Black sesame seeds (til)',
                        'Legumes: chana, dal, rajma'
                    ],
                    'doctor_note': 'Agar weakness bahut zyada ho toh doctor se checkup karwa lena.'
                }
            },
            'cholesterol': {
                'high': {
                    'meaning': 'Cholesterol zyada hai. Isse heart problems ho sakte hain.',
                    'remedies': [
                        'Oats (jai) khayein',
                        'Garlic (lehsun) khayein',
                        'Green tea piyein',
                        'Regular exercise karein',
                        'Oily aur fried food avoid karein',
                        'Fiber-rich foods khayein'
                    ],
                    'doctor_note': 'Please consult doctor for proper cholesterol management.'
                }
            },
            'blood sugar': {
                'high': {
                    'meaning': 'Blood sugar zyada hai. Yeh diabetes ka sign ho sakta hai.',
                    'remedies': [
                        'Bitter gourd (karela) ka juice',
                        'Fenugreek (methi) seeds',
                        'Cinnamon (dalchini)',
                        'Regular exercise',
                        'Sugar aur sweets avoid karein'
                    ],
                    'doctor_note': 'Please consult doctor for proper diabetes management.'
                },
                'low': {
                    'meaning': 'Blood sugar kam hai. Isse weakness, chakkar, ya confusion ho sakti hai.',
                    'remedies': [
                        'Immediate: glucose, sugar water, or fruit juice',
                        'Regular meals khayein',
                        'Complex carbs khayein'
                    ],
                    'doctor_note': 'Agar chakkar ya confusion ho toh immediately doctor se consult karein.'
                }
            },
            'immunity': {
                'low': {
                    'meaning': 'Immunity kam hai. Isse jaldi jaldi illness ho sakti hai.',
                    'remedies': [
                        'Roz subah haldi doodh piyein',
                        'Giloy ka juice',
                        'Tulsi (basil) ki chai',
                        'Amla (Indian gooseberry) khayein',
                        'Citrus fruits: orange, lemon',
                        'Proper sleep lein (7-8 hours)',
                        'Regular exercise karein'
                    ],
                    'doctor_note': 'Agar bahut jaldi jaldi illness ho rahi ho toh doctor se consult karein.'
                }
            },
            'acidity': {
                'high': {
                    'meaning': 'Acidity zyada hai. Isse stomach me burning, discomfort ho sakti hai.',
                    'remedies': [
                        'Saunf (fennel seeds) ka paani piyein',
                        'Cold milk piyein',
                        'Jeera (cumin) water',
                        'Ajwain (carom seeds)',
                        'Spicy aur oily food avoid karein',
                        'Regular meals khayein, skip mat karein'
                    ],
                    'doctor_note': 'Agar acidity bahut zyada ho ya regular ho toh doctor se consult karein.'
                }
            },
            'rbc': {
                'low': {
                    'meaning': 'RBC count kam hai. Isse anemia ho sakta hai, weakness ho sakti hai. Body me lahu (blood) cells kam ban rahe hain.',
                    'remedies': [
                        'Roz 1 glass anaar ka juice piyein',
                        'Chukandar (beetroot) + gajar ka salad khayein',
                        'Palak, bathua, aur leafy greens khayein',
                        'Gur (jaggery) ka paani piyein',
                        'Black raisins (kishmish) pani me bhigo kar khayein',
                        'Dates (khajur) aur dry fruits khayein',
                        'Iron-rich foods: chana, dal, rajma'
                    ],
                    'doctor_note': 'Agar weakness bahut zyada ho ya chakkar aaye toh doctor se checkup karwa lena.'
                }
            },
            'rbc count': {
                'low': {
                    'meaning': 'RBC count kam hai. Isse anemia ho sakta hai, weakness ho sakti hai. Body me lahu (blood) cells kam ban rahe hain.',
                    'remedies': [
                        'Roz 1 glass anaar ka juice piyein',
                        'Chukandar (beetroot) + gajar ka salad khayein',
                        'Palak, bathua, aur leafy greens khayein',
                        'Gur (jaggery) ka paani piyein',
                        'Black raisins (kishmish) pani me bhigo kar khayein',
                        'Dates (khajur) aur dry fruits khayein',
                        'Iron-rich foods: chana, dal, rajma'
                    ],
                    'doctor_note': 'Agar weakness bahut zyada ho ya chakkar aaye toh doctor se checkup karwa lena.'
                }
            },
            'pcv': {
                'low': {
                    'meaning': 'PCV/Hematocrit kam hai. Yeh bhi anemia ka sign hai. Body me lahu (blood) volume kam hai.',
                    'remedies': [
                        'Roz 1 glass anaar ka juice piyein',
                        'Chukandar (beetroot) ka juice',
                        'Palak aur leafy greens khayein',
                        'Gur (jaggery) ka paani piyein',
                        'Dates (khajur) aur dry fruits khayein',
                        'Iron-rich foods: chana, dal, rajma, spinach'
                    ],
                    'doctor_note': 'Agar weakness bahut zyada ho ya chakkar aaye toh doctor se checkup karwa lena.'
                }
            },
            'hematocrit': {
                'low': {
                    'meaning': 'Hematocrit kam hai. Yeh bhi anemia ka sign hai. Body me lahu (blood) volume kam hai.',
                    'remedies': [
                        'Roz 1 glass anaar ka juice piyein',
                        'Chukandar (beetroot) ka juice',
                        'Palak aur leafy greens khayein',
                        'Gur (jaggery) ka paani piyein',
                        'Dates (khajur) aur dry fruits khayein',
                        'Iron-rich foods: chana, dal, rajma, spinach'
                    ],
                    'doctor_note': 'Agar weakness bahut zyada ho ya chakkar aaye toh doctor se checkup karwa lena.'
                }
            }
        }
    
    def parse_lab_report(self, report_text: str) -> List[Dict]:
        """
        Parse lab report text and extract test values
        Handles both structured format and tabular OCR output
        
        Args:
            report_text: Raw lab report text
        
        Returns:
            List of parsed test results
        """
        results = []
        lines = [line.strip() for line in report_text.split('\n')]
        
        # Try to detect table format with column headers (Result, Unit, Range)
        # Look for "Result", "Unit", "BRI/Range Value" headers - can be on same or different lines
        result_header_idx = -1
        unit_header_idx = -1
        range_header_idx = -1
        
        for i, line in enumerate(lines):
            line_lower = line.lower()
            if 'result' in line_lower and result_header_idx == -1:
                result_header_idx = i
            if 'unit' in line_lower and unit_header_idx == -1:
                unit_header_idx = i
            if ('range' in line_lower or 'bri' in line_lower) and range_header_idx == -1:
                range_header_idx = i
        
        # If we found at least Result header, try to parse as table
        if result_header_idx >= 0:
            # Collect test names before first header
            first_header = min([idx for idx in [result_header_idx, unit_header_idx, range_header_idx] if idx >= 0])
            test_names = []
            for i in range(first_header):
                line = lines[i]
                if not line:
                    continue
                # Skip header keywords
                if any(keyword in line.lower() for keyword in ['test', 'result', 'unit', 'range', 'value', 'bri']):
                    continue
                # Check if it looks like a test name (all caps, has letters, no numbers)
                # More flexible pattern to catch test names
                if (re.match(r'^[A-Z][A-Z\s/()]+(?:\([A-Za-z]+\))?\s*$', line) or 
                    (line[0].isupper() and len(line) > 3 and not re.search(r'^\d', line))):
                    if not re.search(r'\d', line):  # No digits in test name
                        test_names.append(line)
            
            # Collect values from lines after Result header
            values = []
            if result_header_idx >= 0:
                for i in range(result_header_idx + 1, len(lines)):
                    line = lines[i]
                    if not line:
                        continue
                    # Stop if we hit another header
                    if unit_header_idx > 0 and i >= unit_header_idx:
                        break
                    # Check if line is a number (including decimals)
                    # Pattern: whole number or decimal (e.g., "38", "1.24", "10.8", "87.10")
                    num_match = re.match(r'^([\d]+\.?[\d]*)\s*$', line)
                    if num_match:
                        try:
                            value_str = num_match.group(1)
                            # Ensure it's a valid number
                            if value_str.replace('.', '', 1).isdigit():
                                values.append(float(value_str))
                        except ValueError:
                            pass
            
            # Collect units from lines after Unit header
            units = []
            if unit_header_idx >= 0:
                for i in range(unit_header_idx + 1, len(lines)):
                    line = lines[i]
                    if not line:
                        continue
                    # Stop if we hit range header or end
                    if range_header_idx > 0 and i >= range_header_idx:
                        break
                    # Check if line looks like a unit
                    unit_match = re.match(r'^([a-zA-Z/%]+)\s*$', line)
                    if unit_match and line.lower() not in ['result', 'unit', 'range', 'value', 'bri']:
                        units.append(line)
            
            # Collect reference ranges from lines after Range header
            reference_ranges = []
            if range_header_idx >= 0:
                for i in range(range_header_idx + 1, len(lines)):
                    line = lines[i]
                    if not line:
                        continue
                    # Extract range pattern: "12-15", "3.8-4.8", "36 - 46", etc.
                    # Pattern: number-number or number - number
                    range_match = re.search(r'([\d]+\.?[\d]*)\s*[-–]\s*([\d]+\.?[\d]*)', line)
                    if range_match:
                        try:
                            min_val = float(range_match.group(1))
                            max_val = float(range_match.group(2))
                            reference_ranges.append((min_val, max_val))
                        except ValueError:
                            pass
                    # Also check for single numbers (might be a range indicator)
                    elif re.match(r'^[\d]+\.?[\d]*\s*$', line):
                        # Single number - might be a threshold, skip for now
                        pass
            
            # Match test names with values, units, and reference ranges by index
            # Only match if we have at least one value
            if values:
                # Match up to the minimum of test names and values
                max_matches = min(len(test_names), len(values))
                for idx in range(max_matches):
                    test_name = test_names[idx]
                    value = values[idx]
                    unit = units[idx] if idx < len(units) else ''
                    # Get reference range if available
                    ref_range = reference_ranges[idx] if idx < len(reference_ranges) else None
                    
                    # Determine status based on reference range from table
                    status = None
                    if ref_range:
                        min_val, max_val = ref_range
                        if value < min_val:
                            status = 'Low'
                        elif value > max_val:
                            status = 'High'
                        else:
                            status = 'Normal'
                    
                    results.append({
                        'test_name': test_name,
                        'value': value,
                        'unit': unit,
                        'status': status,
                        'reference_range': ref_range,
                        'raw_line': f"{test_name} | {value} | {unit} | {ref_range if ref_range else 'N/A'}"
                    })
            
            if results:
                return results
        
        # Fallback: line-by-line parsing
        current_test = None
        
        for i, line in enumerate(lines):
            line = line.strip()
            if not line:
                continue
            
            # Pattern: Test Name: Value Unit (Status)
            # Examples:
            # "Hemoglobin: 8.5 g/dL (Low)"
            # "Vitamin D: 15 ng/mL (Low)"
            # "Calcium: 7.2 mg/dL (Low)"
            
            # Pattern 1: "Test Name: Value Unit (Status)"
            # Updated to capture decimals: \d+\.?\d* matches whole numbers and decimals
            pattern1 = r'([^:]+):\s*([\d]+\.?[\d]*)\s*([a-zA-Z/%]+)?\s*\(?(Low|High|Critical|Normal|Abnormal)\)?'
            match = re.search(pattern1, line, re.IGNORECASE)
            if match:
                test_name = match.group(1).strip()
                try:
                    value = float(match.group(2))
                    unit = match.group(3).strip() if match.group(3) and match.group(3) not in ['Low', 'High', 'Critical', 'Normal', 'Abnormal'] else ''
                    status = match.group(4) if match.group(4) in ['Low', 'High', 'Critical', 'Normal', 'Abnormal'] else None
                    
                    results.append({
                        'test_name': test_name,
                        'value': value,
                        'unit': unit,
                        'status': status,
                        'raw_line': line
                    })
                except ValueError:
                    pass
                continue
            
            # Pattern 2: "Test Name: Value (Status)"
            # Updated to capture decimals
            pattern2 = r'([^:]+):\s*([\d]+\.?[\d]*)\s*\(?(Low|High|Critical|Normal|Abnormal)\)?'
            match = re.search(pattern2, line, re.IGNORECASE)
            if match:
                test_name = match.group(1).strip()
                try:
                    value = float(match.group(2))
                    status = match.group(3) if match.group(3) in ['Low', 'High', 'Critical', 'Normal', 'Abnormal'] else None
                    
                    results.append({
                        'test_name': test_name,
                        'value': value,
                        'unit': '',
                        'status': status,
                        'raw_line': line
                    })
                except ValueError:
                    pass
                continue
            
            # Pattern 3: Tabular format - Test name on one line, value on next
            # Look for test names (usually all caps or title case)
            test_name_pattern = r'^([A-Z][A-Z\s/()]+(?:\([A-Za-z]+\))?)\s*$'
            test_match = re.match(test_name_pattern, line)
            if test_match and len(line) > 3 and not re.search(r'\d+', line):
                # This might be a test name
                potential_test = test_match.group(1).strip()
                # Check if next line has a number (value)
                if i + 1 < len(lines):
                    next_line = lines[i + 1].strip()
                    # Updated to capture decimals: \d+\.?\d* matches whole numbers and decimals
                    value_match = re.search(r'([\d]+\.?[\d]*)', next_line)
                    if value_match:
                        try:
                            value_str = value_match.group(1)
                            if value_str.replace('.', '', 1).isdigit():
                                value = float(value_str)
                            # Extract unit from next line or line after
                            unit = ''
                            unit_match = re.search(r'([a-zA-Z/%]+)', next_line)
                            if unit_match:
                                unit = unit_match.group(1).strip()
                            
                            results.append({
                                'test_name': potential_test,
                                'value': value,
                                'unit': unit,
                                'status': None,
                                'raw_line': f"{line} | {next_line}"
                            })
                        except ValueError:
                            pass
                continue
            
            # Pattern 4: Single line with test name and value separated by spaces/tabs
            # Format: "HAEMOGLOBIN (Hb)    38    gm/dl    12-15" or "RBC Count    1.24    millions/cmm"
            # Updated to capture decimals
            tabular_pattern = r'^([A-Z][A-Z\s/()]+(?:\([A-Za-z]+\))?)\s+([\d]+\.?[\d]*)\s+([a-zA-Z/%]+)?\s*([\d.-]+)?'
            tab_match = re.match(tabular_pattern, line)
            if tab_match:
                test_name = tab_match.group(1).strip()
                try:
                    value = float(tab_match.group(2))
                    unit = tab_match.group(3).strip() if tab_match.group(3) else ''
                    
                    results.append({
                        'test_name': test_name,
                        'value': value,
                        'unit': unit,
                        'status': None,
                        'raw_line': line
                    })
                except ValueError:
                    pass
                continue
            
            # Pattern 6: Multi-line tabular format (OCR common output)
            # Test name on line, value on next line, unit on next, range on next
            # Store test name if it looks like one
            if re.match(r'^[A-Z][A-Z\s/()]+(?:\([A-Za-z]+\))?\s*$', line) and len(line) > 3:
                # This looks like a test name - store it and check next lines
                potential_test_name = line.strip()
                # Look ahead 1-3 lines for value
                for lookahead in range(1, min(4, len(lines) - i)):
                    next_line = lines[i + lookahead].strip() if i + lookahead < len(lines) else ""
                    if not next_line:
                        continue
                    # Check if this line has a number (value) - including decimals
                    value_match = re.search(r'^([\d]+\.?[\d]*)\s*$', next_line)
                    if value_match:
                        try:
                            value_str = value_match.group(1)
                            if value_str.replace('.', '', 1).isdigit():
                                value = float(value_str)
                            # Check next line for unit
                            unit = ''
                            if i + lookahead + 1 < len(lines):
                                unit_line = lines[i + lookahead + 1].strip()
                                unit_match = re.search(r'^([a-zA-Z/%]+)\s*$', unit_line)
                                if unit_match:
                                    unit = unit_match.group(1).strip()
                            
                            results.append({
                                'test_name': potential_test_name,
                                'value': value,
                                'unit': unit,
                                'status': None,
                                'raw_line': f"{line} | {next_line}"
                            })
                            break  # Found value, move on
                        except ValueError:
                            pass
                continue
            
            # Pattern 5: Just a number on a line (might be a value for previous test)
            # This is a fallback for poorly formatted OCR - updated to capture decimals
            number_only = re.match(r'^([\d]+\.?[\d]*)\s*$', line)
            if number_only and current_test:
                try:
                    value = float(number_only.group(1))
                    results.append({
                        'test_name': current_test,
                        'value': value,
                        'unit': '',
                        'status': None,
                        'raw_line': line
                    })
                    current_test = None
                except ValueError:
                    pass
        
        return results
    
    def analyze_value(self, test_name: str, value: float, unit: str = '', gender: str = '') -> Dict:
        """
        Analyze a single test value and determine if it's abnormal
        
        Args:
            test_name: Name of the test
            value: Test value
            unit: Unit of measurement
            gender: Patient gender (for gender-specific ranges)
        
        Returns:
            Analysis result with status and suggestions
        """
        test_name_lower = test_name.lower().strip()
        
        # Find matching reference range
        ref_range = None
        for key, ranges in self.lab_reference_ranges.items():
            if key in test_name_lower:
                ref_range = ranges
                break
        
        if not ref_range:
            return None
        
        # Get normal range
        if ref_range.get('gender_specific') and gender:
            if gender.lower() == 'male':
                normal_range = ref_range.get('male', ref_range['normal'])
            else:
                normal_range = ref_range.get('female', ref_range['normal'])
        else:
            normal_range = ref_range['normal']
        
        min_val, max_val = normal_range
        
        # Determine status
        status = 'Normal'
        severity = 'mild'
        
        if value < min_val:
            status = 'Low'
            # Calculate how low
            deviation = (min_val - value) / min_val
            if deviation > 0.3:
                severity = 'critical'
            elif deviation > 0.15:
                severity = 'moderate'
        elif value > max_val:
            status = 'High'
            # Calculate how high
            deviation = (value - max_val) / max_val
            if deviation > 0.3:
                severity = 'critical'
            elif deviation > 0.15:
                severity = 'moderate'
        
        # Get remedy suggestions
        remedy_info = None
        test_key = test_name_lower
        for key in self.remedy_knowledge_base.keys():
            if key in test_key:
                test_key = key
                break
        
        if test_key in self.remedy_knowledge_base:
            if status.lower() in self.remedy_knowledge_base[test_key]:
                remedy_info = self.remedy_knowledge_base[test_key][status.lower()]
        
        return {
            'test_name': test_name,
            'value': value,
            'unit': unit or ref_range.get('unit', ''),
            'normal_range': f"{min_val}-{max_val} {ref_range.get('unit', '')}",
            'status': status,
            'severity': severity,
            'remedy_info': remedy_info
        }
    
    def analyze_report(self, report_text: str, gender: str = '') -> Dict:
        """
        Analyze complete lab report and provide suggestions
        
        Args:
            report_text: Raw lab report text
            gender: Patient gender (optional)
        
        Returns:
            Complete analysis with all findings and suggestions
        """
        # Parse report
        parsed_results = self.parse_lab_report(report_text)
        
        if not parsed_results:
            return {
                'error': 'Could not parse lab report. Please ensure the report is in text format with test names and values.',
                'suggestions': []
            }
        
        # Analyze each result
        findings = []
        for result in parsed_results:
            # If reference range was extracted from table, use it directly
            if result.get('reference_range') and result.get('status'):
                # Use the status and range from the table
                ref_range = result['reference_range']
                min_val, max_val = ref_range
                status = result['status']
                
                # Only analyze if abnormal
                if status != 'Normal':
                    # Calculate severity
                    severity = 'mild'
                    if status == 'Low':
                        deviation = (min_val - result['value']) / min_val if min_val > 0 else 0
                        if deviation > 0.3:
                            severity = 'critical'
                        elif deviation > 0.15:
                            severity = 'moderate'
                    elif status == 'High':
                        deviation = (result['value'] - max_val) / max_val if max_val > 0 else 0
                        if deviation > 0.3:
                            severity = 'critical'
                        elif deviation > 0.15:
                            severity = 'moderate'
                    
                    # Get remedy suggestions
                    test_name_lower = result['test_name'].lower().strip()
                    remedy_info = None
                    test_key = None
                    
                    # Try to find matching key in knowledge base
                    # Remove common words and extract key terms
                    test_clean = test_name_lower
                    # Remove common words
                    for word in ['total', 'count', 'mean', 'corp', 'distribution', 'width', 'concentration', 'conc']:
                        test_clean = test_clean.replace(word, '')
                    test_clean = ' '.join(test_clean.split())  # Normalize spaces
                    
                    # Try multiple matching strategies
                    for key in self.remedy_knowledge_base.keys():
                        # Direct match
                        if key in test_name_lower or test_name_lower in key:
                            test_key = key
                            break
                        # Match after cleaning
                        if key in test_clean or test_clean in key:
                            test_key = key
                            break
                        # Match key parts (e.g., "haemoglobin" matches "hemoglobin")
                        key_words = key.split()
                        test_words = test_name_lower.split()
                        if any(kw in test_name_lower for kw in key_words if len(kw) > 3):
                            test_key = key
                            break
                    
                    # Special cases for common test name variations
                    if not test_key:
                        if 'haemoglobin' in test_name_lower or 'hb' in test_name_lower or 'hemoglobin' in test_name_lower:
                            test_key = 'hemoglobin'
                        elif 'rbc' in test_name_lower and 'count' in test_name_lower:
                            test_key = 'rbc count'
                        elif 'rbc' in test_name_lower:
                            test_key = 'rbc'
                        elif 'hematocrit' in test_name_lower or 'hamatocrit' in test_name_lower:
                            test_key = 'hematocrit'
                        elif 'pcv' in test_name_lower or 'p.c.v' in test_name_lower:
                            test_key = 'pcv'
                        elif 'mchc' in test_name_lower or 'mean corp hb conc' in test_name_lower:
                            # MCHC doesn't have remedies, skip
                            pass
                        elif 'rdw' in test_name_lower:
                            # RDW doesn't have remedies, skip
                            pass
                        elif 'pdw' in test_name_lower:
                            # PDW doesn't have remedies, skip
                            pass
                    
                    if test_key and test_key in self.remedy_knowledge_base:
                        if status.lower() in self.remedy_knowledge_base[test_key]:
                            remedy_info = self.remedy_knowledge_base[test_key][status.lower()]
                    
                    findings.append({
                        'test_name': result['test_name'],
                        'value': result['value'],
                        'unit': result.get('unit', ''),
                        'normal_range': f"{min_val}-{max_val} {result.get('unit', '')}",
                        'status': status,
                        'severity': severity,
                        'remedy_info': remedy_info
                    })
            else:
                # Fallback to standard analysis if no table range found
                analysis = self.analyze_value(
                    result['test_name'],
                    result['value'],
                    result.get('unit', ''),
                    gender
                )
                
                if analysis and analysis['status'] != 'Normal':
                    findings.append(analysis)
        
        # Generate response
        response = {
            'total_tests': len(parsed_results),
            'abnormal_findings': len(findings),
            'findings': [],
            'timestamp': datetime.now().isoformat()
        }
        
        for finding in findings:
            # Format test name - remove extra spaces and normalize
            test_name = finding['test_name'].strip()
            # If test name has parentheses, keep it simple
            if '(' in test_name:
                # Extract main name before parentheses
                test_name = test_name.split('(')[0].strip()
            
            finding_response = {
                'problem': f"{test_name} {finding['status'].lower()} hai.",
                'meaning': '',
                'remedies': [],
                'doctor_note': ''
            }
            
            if finding['remedy_info']:
                finding_response['meaning'] = finding['remedy_info']['meaning']
                finding_response['remedies'] = finding['remedy_info']['remedies']
                # Always include doctor note if available, otherwise use default
                finding_response['doctor_note'] = finding['remedy_info'].get('doctor_note', '')
            else:
                finding_response['meaning'] = f"Yeh value normal se {finding['status'].lower()} hai."
                finding_response['doctor_note'] = 'Please consult doctor for proper evaluation.'
            
            response['findings'].append(finding_response)
        
        if not findings:
            response['message'] = 'Sab values normal lag rahe hain! Aap healthy hain. 👍'
        
        return response


# Global instance
_analyzer = None

def get_analyzer() -> LabReportAnalyzer:
    """Get or create global analyzer instance"""
    global _analyzer
    if _analyzer is None:
        _analyzer = LabReportAnalyzer()
    return _analyzer

