/**
 * سكريبت لإضافة بيانات تجريبية شاملة لنظام FarmDreamERP
 * يتم تشغيله بعد بدء السيرفر
 */

const baseURL = 'http://localhost:5001/api';

// دالة لإرسال طلب POST
async function postData(endpoint, data) {
  try {
    const response = await fetch(`${baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }
    
    const result = await response.json();
    console.log(`✅ تم إضافة: ${endpoint}`);
    return result;
  } catch (error) {
    console.error(`❌ خطأ في ${endpoint}:`, error.message);
    return null;
  }
}

// دالة لحذف كل البيانات
async function clearAllData() {
  console.log('\n🗑️  مسح البيانات القديمة...\n');
  
  const endpoints = [
    '/vouchers',
    '/treatments',
    '/inventory-transactions',
    '/performance-goals',
    '/animal-sales',
    '/batch-expenses',
    '/batches',
    '/transactions',
    '/animals',
    '/inventory',
    '/customers',
    '/suppliers',
    '/receptions'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseURL}${endpoint}`);
      const items = await response.json();
      
      for (const item of items) {
        await fetch(`${baseURL}${endpoint}/${item.id}`, { method: 'DELETE' });
      }
      console.log(`🗑️  تم مسح ${endpoint}`);
    } catch (error) {
      console.log(`⚠️  تحذير: ${endpoint} - ${error.message}`);
    }
  }
  
  console.log('\n✅ تم مسح كل البيانات القديمة\n');
}

async function seedData() {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('🌱 بدء إنشاء البيانات التجريبية لنظام FarmDreamERP');
  console.log('═══════════════════════════════════════════════════════\n');

  // 1. إضافة الموردين
  console.log('\n📦 إضافة الموردين...\n');
  
  const supplier1 = await postData('/suppliers', {
    name: 'مورد الأعلاف المركزة المتحدة',
    type: 'feed',
    contactPerson: 'أحمد محمود السيد',
    phone: '01012345678',
    email: 'feed@supplier.com',
    address: 'القاهرة، مصر الجديدة',
    balance: 45000,
    notes: 'مورد رئيسي للأعلاف المركزة عالية الجودة - تعامل منذ 2020'
  });

  const supplier2 = await postData('/suppliers', {
    name: 'مورد الأدوية البيطرية الحديثة',
    type: 'veterinary',
    contactPerson: 'د. خالد السيد حسن',
    phone: '01098765432',
    email: 'vet@supplier.com',
    address: 'الإسكندرية، سموحة',
    balance: 28500,
    notes: 'متخصص في الأدوية واللقاحات البيطرية المستوردة'
  });

  const supplier3 = await postData('/suppliers', {
    name: 'شركة استيراد العجول الأوروبية',
    type: 'animals',
    contactPerson: 'محمد فتحي عبدالله',
    phone: '01123456789',
    email: 'cattle@import.com',
    address: 'الجيزة، المهندسين',
    balance: 125000,
    notes: 'استيراد عجول فريزيان وهولشتاين عالية الجودة من أوروبا'
  });

  // 2. إضافة العملاء
  console.log('\n👥 إضافة العملاء...\n');
  
  const customer1 = await postData('/customers', {
    name: 'محمد أحمد التاجر',
    type: 'wholesale',
    contactPerson: 'محمد أحمد',
    phone: '01234567890',
    email: 'mohamed@trader.com',
    address: 'القاهرة، العباسية',
    balance: 75000,
    notes: 'عميل رئيسي - تجارة الجملة للمواشي'
  });

  const customer2 = await postData('/customers', {
    name: 'شركة اللحوم المتحدة للتجارة',
    type: 'corporate',
    contactPerson: 'علي حسن محمد',
    phone: '01098765432',
    email: 'info@meatco.com',
    address: 'الإسكندرية، محرم بك',
    balance: 150000,
    notes: 'شركة كبرى متخصصة في تجارة اللحوم والتصدير'
  });

  const customer3 = await postData('/customers', {
    name: 'سوبر ماركت النخبة',
    type: 'retail',
    contactPerson: 'أحمد سعيد علي',
    phone: '01156789012',
    email: 'elite@supermarket.com',
    address: 'الجيزة، المعادي',
    balance: 45000,
    notes: 'سلسلة محلات تجزئة - 5 فروع'
  });

  const customer4 = await postData('/customers', {
    name: 'مطاعم الفخامة للولائم',
    type: 'retail',
    contactPerson: 'حسن إبراهيم',
    phone: '01187654321',
    email: 'luxury@restaurants.com',
    address: 'القاهرة، مدينة نصر',
    balance: 32000,
    notes: 'سلسلة مطاعم فاخرة - طلبات منتظمة'
  });

  // 3. إضافة أصناف المخزون
  console.log('\n📦 إضافة أصناف المخزون...\n');
  
  await postData('/inventory', {
    itemCode: 'FEED-001',
    itemName: 'علف مركز - بروتين 18%',
    category: 'feed',
    unit: 'كجم',
    quantity: 5000,
    minQuantity: 1000,
    unitPrice: 8.5,
    totalValue: 42500,
    supplierId: supplier1?.id,
    location: 'مخزن A - رف 1',
    notes: 'علف عالي البروتين للتسمين السريع'
  });

  await postData('/inventory', {
    itemCode: 'FEED-002',
    itemName: 'علف بادئ - بروتين 20%',
    category: 'feed',
    unit: 'كجم',
    quantity: 3000,
    minQuantity: 500,
    unitPrice: 10,
    totalValue: 30000,
    supplierId: supplier1?.id,
    location: 'مخزن A - رف 2',
    notes: 'للعجول الصغيرة في بداية التسمين'
  });

  await postData('/inventory', {
    itemCode: 'MED-001',
    itemName: 'لقاح الحمى القلاعية',
    category: 'veterinary',
    unit: 'جرعة',
    quantity: 500,
    minQuantity: 100,
    unitPrice: 15,
    totalValue: 7500,
    supplierId: supplier2?.id,
    location: 'ثلاجة الأدوية - رف 1',
    notes: 'يحفظ في الثلاجة 2-8 درجة مئوية'
  });

  await postData('/inventory', {
    itemCode: 'MED-002',
    itemName: 'مضاد حيوي واسع المدى',
    category: 'veterinary',
    unit: 'علبة',
    quantity: 150,
    minQuantity: 30,
    unitPrice: 85,
    totalValue: 12750,
    supplierId: supplier2?.id,
    location: 'ثلاجة الأدوية - رف 2',
    notes: 'للحالات المرضية الطارئة'
  });

  await postData('/inventory', {
    itemCode: 'SUPP-001',
    itemName: 'مكمل فيتامينات ومعادن',
    category: 'supplements',
    unit: 'كجم',
    quantity: 300,
    minQuantity: 50,
    unitPrice: 45,
    totalValue: 13500,
    supplierId: supplier1?.id,
    location: 'مخزن B - رف 1',
    notes: 'يضاف للعلف يومياً - 50 جرام لكل رأس'
  });

  // 4. إضافة الدفعات
  console.log('\n📊 إضافة دفعات التربية...\n');
  
  const batch1 = await postData('/batches', {
    batchName: 'دفعة يناير 2024 - فريزيان',
    batchCode: 'B-2024-01',
    startDate: '2024-01-15',
    animalType: 'cattle',
    breed: 'friesian',
    initialCount: 50,
    currentCount: 48,
    status: 'active',
    targetWeight: 500,
    averageWeight: 380,
    feedType: 'علف مركز 18%',
    notes: 'دفعة متميزة من العجول الفريزيان المستوردة - معدل نمو ممتاز'
  });

  const batch2 = await postData('/batches', {
    batchName: 'دفعة مارس 2024 - بلدي',
    batchCode: 'B-2024-03',
    startDate: '2024-03-10',
    animalType: 'cattle',
    breed: 'baladi',
    initialCount: 30,
    currentCount: 30,
    status: 'active',
    targetWeight: 450,
    averageWeight: 320,
    feedType: 'علف مركز 16%',
    notes: 'عجول بلدية للتسمين السريع - حالة صحية ممتازة'
  });

  const batch3 = await postData('/batches', {
    batchName: 'دفعة يونيو 2024 - خليط',
    batchCode: 'B-2024-06',
    startDate: '2024-06-20',
    animalType: 'cattle',
    breed: 'crossbreed',
    initialCount: 25,
    currentCount: 25,
    status: 'active',
    targetWeight: 480,
    averageWeight: 280,
    feedType: 'علف بادئ 20%',
    notes: 'دفعة حديثة - عجول صغيرة في بداية التسمين'
  });

  // 5. إضافة الحيوانات
  console.log('\n🐄 إضافة الحيوانات...\n');
  
  // عجول فريزيان - دفعة 1
  for (let i = 1; i <= 15; i++) {
    const day = (i % 28) + 1;
    await postData('/animals', {
      earTag: `FR-${String(i).padStart(3, '0')}`,
      animalType: 'cattle',
      breed: 'friesian',
      birthDate: `2023-10-${String(day).padStart(2, '0')}`,
      gender: i % 2 === 0 ? 'male' : 'female',
      weight: 350 + Math.floor(Math.random() * 100),
      healthStatus: 'healthy',
      batchId: batch1?.id,
      status: 'active',
      acquisitionDate: '2024-01-15',
      acquisitionPrice: 15000 + Math.floor(Math.random() * 5000),
      supplierId: supplier3?.id,
      notes: `عجل فريزيان عالي الجودة - رقم ${i}`
    });
  }

  // عجول بلدي - دفعة 2
  for (let i = 1; i <= 10; i++) {
    const day = (i % 28) + 1;
    await postData('/animals', {
      earTag: `BL-${String(i).padStart(3, '0')}`,
      animalType: 'cattle',
      breed: 'baladi',
      birthDate: `2023-12-${String(day).padStart(2, '0')}`,
      gender: i % 2 === 0 ? 'male' : 'female',
      weight: 280 + Math.floor(Math.random() * 80),
      healthStatus: 'healthy',
      batchId: batch2?.id,
      status: 'active',
      acquisitionDate: '2024-03-10',
      acquisitionPrice: 12000 + Math.floor(Math.random() * 3000),
      notes: `عجل بلدي للتسمين - رقم ${i}`
    });
  }

  // عجول خليط - دفعة 3
  for (let i = 1; i <= 8; i++) {
    const day = (i % 28) + 1;
    await postData('/animals', {
      earTag: `MX-${String(i).padStart(3, '0')}`,
      animalType: 'cattle',
      breed: 'crossbreed',
      birthDate: `2024-03-${String(day).padStart(2, '0')}`,
      gender: i % 2 === 0 ? 'male' : 'female',
      weight: 180 + Math.floor(Math.random() * 50),
      healthStatus: 'healthy',
      batchId: batch3?.id,
      status: 'active',
      acquisitionDate: '2024-06-20',
      acquisitionPrice: 10000 + Math.floor(Math.random() * 2000),
      notes: `عجل خليط - رقم ${i}`
    });
  }

  console.log('✅ تم إضافة 33 حيوان بنجاح\n');

  // 6. إضافة أهداف الأداء
  console.log('\n🎯 إضافة أهداف الأداء...\n');
  
  await postData('/performance-goals', {
    goalName: 'معدل النمو اليومي - دفعة يناير',
    goalType: 'adg',
    targetValue: '1.4',
    currentValue: '1.25',
    unit: 'كجم/يوم',
    batchId: batch1?.id,
    startDate: '2024-01-15',
    endDate: '2024-07-15',
    priority: 'high',
    status: 'active',
    description: 'تحقيق معدل نمو يومي 1.4 كجم للوصول للوزن المستهدف',
    notes: 'متابعة دقيقة للوزن أسبوعياً - النتائج مشجعة'
  });

  await postData('/performance-goals', {
    goalName: 'معامل التحويل الغذائي - FCR العام',
    goalType: 'fcr',
    targetValue: '6.5',
    currentValue: '7.2',
    unit: '',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    priority: 'critical',
    status: 'active',
    description: 'تحسين كفاءة استخدام الأعلاف لتقليل التكاليف',
    notes: 'الهدف الأساسي لزيادة الربحية - يحتاج تحسين'
  });

  await postData('/performance-goals', {
    goalName: 'معدل البقاء على قيد الحياة',
    goalType: 'survival_rate',
    targetValue: '98',
    currentValue: '96',
    unit: '%',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    priority: 'high',
    status: 'active',
    description: 'تحقيق معدل بقاء 98% من خلال تحسين الرعاية الصحية',
    notes: 'تحسين البرنامج البيطري الوقائي'
  });

  await postData('/performance-goals', {
    goalName: 'متوسط الوزن النهائي - دفعة مارس',
    goalType: 'weight_gain',
    targetValue: '450',
    currentValue: '320',
    unit: 'كجم',
    batchId: batch2?.id,
    startDate: '2024-03-10',
    endDate: '2024-09-10',
    priority: 'medium',
    status: 'active',
    description: 'الوصول لمتوسط وزن 450 كجم خلال 6 أشهر',
    notes: 'على المسار الصحيح - نمو جيد'
  });

  await postData('/performance-goals', {
    goalName: 'كفاءة استهلاك العلف - دفعة يونيو',
    goalType: 'feed_efficiency',
    targetValue: '15',
    currentValue: '12',
    unit: 'كجم علف/كجم وزن',
    batchId: batch3?.id,
    startDate: '2024-06-20',
    endDate: '2024-12-20',
    priority: 'medium',
    status: 'active',
    description: 'تحسين معدل تحويل العلف للعجول الصغيرة',
    notes: 'دفعة جديدة - متابعة مستمرة'
  });

  // 7. إضافة السجلات البيطرية
  console.log('\n💉 إضافة السجلات البيطرية...\n');
  
  await postData('/treatments', {
    animalId: '1',
    treatmentDate: '2024-10-01',
    treatmentType: 'vaccination',
    diagnosis: 'برنامج التحصين الروتيني',
    medication: 'لقاح الحمى القلاعية',
    dosage: '5 مل',
    administeredBy: 'د. محمد أحمد السيد',
    cost: 45,
    nextVisitDate: '2024-11-01',
    notes: 'تم التطعيم بنجاح - لا توجد آثار جانبية'
  });

  await postData('/treatments', {
    animalId: '2',
    treatmentDate: '2024-10-05',
    treatmentType: 'preventive',
    diagnosis: 'مكافحة الطفيليات الداخلية',
    medication: 'إيفرمكتين',
    dosage: '10 مل',
    administeredBy: 'د. خالد حسن',
    cost: 35,
    nextVisitDate: '2024-11-05',
    notes: 'جرعة وقائية ضد الطفيليات - حالة ممتازة'
  });

  await postData('/treatments', {
    animalId: '5',
    treatmentDate: '2024-09-20',
    treatmentType: 'treatment',
    diagnosis: 'التهاب في الجهاز التنفسي',
    medication: 'مضاد حيوي واسع المدى',
    dosage: '15 مل يومياً لمدة 5 أيام',
    administeredBy: 'د. محمد أحمد السيد',
    cost: 120,
    nextVisitDate: '2024-10-20',
    notes: 'تم الشفاء الكامل - استجابة ممتازة للعلاج'
  });

  await postData('/treatments', {
    animalId: '8',
    treatmentDate: '2024-10-10',
    treatmentType: 'vaccination',
    diagnosis: 'تطعيم ضد الجلد العقدي',
    medication: 'لقاح الجلد العقدي',
    dosage: '2 مل',
    administeredBy: 'د. خالد حسن',
    cost: 38,
    nextVisitDate: '2024-11-10',
    notes: 'تطعيم وقائي ضمن البرنامج السنوي'
  });

  await postData('/treatments', {
    animalId: '12',
    treatmentDate: '2024-09-28',
    treatmentType: 'checkup',
    diagnosis: 'فحص دوري شامل',
    medication: 'فيتامينات ومقويات',
    dosage: '50 مل',
    administeredBy: 'د. محمد أحمد السيد',
    cost: 55,
    nextVisitDate: '2024-10-28',
    notes: 'حالة صحية ممتازة - نمو طبيعي'
  });

  // 8. إضافة المعاملات المالية
  console.log('\n💰 إضافة المعاملات المالية...\n');
  
  await postData('/transactions', {
    transactionNumber: 'TRX-2024-001',
    transactionDate: '2024-01-15',
    transactionType: 'purchase',
    description: 'شراء دفعة عجول فريزيان - 50 رأس',
    amount: 750000,
    paymentMethod: 'bank_transfer',
    relatedEntity: 'supplier',
    relatedEntityId: supplier3?.id,
    status: 'completed',
    notes: 'دفعة يناير 2024 - استيراد من أوروبا'
  });

  await postData('/transactions', {
    transactionNumber: 'TRX-2024-002',
    transactionDate: '2024-02-01',
    transactionType: 'purchase',
    description: 'شراء علف مركز - 5 طن',
    amount: 42500,
    paymentMethod: 'cash',
    relatedEntity: 'supplier',
    relatedEntityId: supplier1?.id,
    status: 'completed',
    notes: 'علف بروتين 18% - توريد شهري'
  });

  await postData('/transactions', {
    transactionNumber: 'TRX-2024-003',
    transactionDate: '2024-03-10',
    transactionType: 'purchase',
    description: 'شراء عجول بلدية - 30 رأس',
    amount: 360000,
    paymentMethod: 'bank_transfer',
    relatedEntity: 'supplier',
    relatedEntityId: supplier3?.id,
    status: 'completed',
    notes: 'دفعة مارس 2024'
  });

  await postData('/transactions', {
    transactionNumber: 'TRX-2024-004',
    transactionDate: '2024-09-15',
    transactionType: 'sale',
    description: 'بيع 10 رؤوس عجول مسمنة',
    amount: 285000,
    paymentMethod: 'bank_transfer',
    relatedEntity: 'customer',
    relatedEntityId: customer1?.id,
    status: 'completed',
    notes: 'عجول وزن متوسط 500 كجم - سعر 57 جنيه/كجم'
  });

  await postData('/transactions', {
    transactionNumber: 'TRX-2024-005',
    transactionDate: '2024-10-05',
    transactionType: 'sale',
    description: 'بيع 15 رأس للشركة المتحدة',
    amount: 435000,
    paymentMethod: 'bank_transfer',
    relatedEntity: 'customer',
    relatedEntityId: customer2?.id,
    status: 'completed',
    notes: 'عقد توريد شهري - أعلى سعر في السوق'
  });

  await postData('/transactions', {
    transactionNumber: 'TRX-2024-006',
    transactionDate: '2024-04-20',
    transactionType: 'purchase',
    description: 'شراء أدوية ولقاحات',
    amount: 15000,
    paymentMethod: 'cash',
    relatedEntity: 'supplier',
    relatedEntityId: supplier2?.id,
    status: 'completed',
    notes: 'مخزون الأدوية الدوري'
  });

  // 9. إضافة حركات المخزون
  console.log('\n📦 إضافة حركات المخزون...\n');
  
  await postData('/inventory-transactions', {
    itemId: '1', // FEED-001
    transactionType: 'in',
    quantity: 5000,
    unitPrice: 8.5,
    totalValue: 42500,
    transactionDate: '2024-02-01',
    referenceNumber: 'REC-2024-001',
    notes: 'استلام شحنة علف مركز - 5 طن'
  });

  await postData('/inventory-transactions', {
    itemId: '1', // FEED-001
    transactionType: 'out',
    quantity: 2000,
    unitPrice: 8.5,
    totalValue: 17000,
    transactionDate: '2024-08-15',
    referenceNumber: 'ISS-2024-001',
    notes: 'صرف علف لدفعة يناير - شهرين'
  });

  await postData('/inventory-transactions', {
    itemId: '3', // MED-001
    transactionType: 'in',
    quantity: 500,
    unitPrice: 15,
    totalValue: 7500,
    transactionDate: '2024-04-20',
    referenceNumber: 'REC-2024-002',
    notes: 'استلام لقاحات الحمى القلاعية'
  });

  await postData('/inventory-transactions', {
    itemId: '3', // MED-001
    transactionType: 'out',
    quantity: 50,
    unitPrice: 15,
    totalValue: 750,
    transactionDate: '2024-10-01',
    referenceNumber: 'ISS-2024-002',
    notes: 'صرف جرعات لبرنامج التطعيم'
  });

  await postData('/inventory-transactions', {
    itemId: '5', // SUPP-001
    transactionType: 'in',
    quantity: 300,
    unitPrice: 45,
    totalValue: 13500,
    transactionDate: '2024-05-10',
    referenceNumber: 'REC-2024-003',
    notes: 'استلام مكملات غذائية'
  });

  // 10. إضافة مصروفات الدفعات
  console.log('\n💸 إضافة مصروفات الدفعات...\n');
  
  await postData('/batch-expenses', {
    batchId: batch1?.id,
    expenseType: 'feed',
    expenseDate: '2024-08-01',
    amount: 25000,
    quantity: 2000,
    unitPrice: 8.5,
    itemId: '1',
    notes: 'علف شهر أغسطس - دفعة يناير'
  });

  await postData('/batch-expenses', {
    batchId: batch1?.id,
    expenseType: 'veterinary',
    expenseDate: '2024-10-01',
    amount: 2250,
    quantity: 50,
    unitPrice: 45,
    itemId: '3',
    notes: 'تطعيمات الدفعة'
  });

  await postData('/batch-expenses', {
    batchId: batch2?.id,
    expenseType: 'feed',
    expenseDate: '2024-08-01',
    amount: 15000,
    quantity: 1500,
    unitPrice: 10,
    itemId: '2',
    notes: 'علف بادئ - دفعة مارس'
  });

  await postData('/batch-expenses', {
    batchId: batch3?.id,
    expenseType: 'supplements',
    expenseDate: '2024-07-15',
    amount: 3000,
    quantity: 60,
    unitPrice: 50,
    notes: 'مكملات غذائية - دفعة يونيو'
  });

  // 11. إضافة سجلات البيع
  console.log('\n📈 إضافة سجلات المبيعات...\n');
  
  await postData('/animal-sales', {
    animalId: '3',
    customerId: customer1?.id,
    saleDate: '2024-09-15',
    weight: 520,
    pricePerKg: 57,
    totalPrice: 29640,
    paymentMethod: 'bank_transfer',
    status: 'completed',
    notes: 'عجل فريزيان ممتاز - وزن نهائي ممتاز'
  });

  await postData('/animal-sales', {
    animalId: '7',
    customerId: customer2?.id,
    saleDate: '2024-10-05',
    weight: 495,
    pricePerKg: 58,
    totalPrice: 28710,
    paymentMethod: 'bank_transfer',
    status: 'completed',
    notes: 'عقد توريد شهري مع الشركة المتحدة'
  });

  await postData('/animal-sales', {
    animalId: '9',
    customerId: customer3?.id,
    saleDate: '2024-10-08',
    weight: 480,
    pricePerKg: 56,
    totalPrice: 26880,
    paymentMethod: 'cash',
    status: 'completed',
    notes: 'بيع مباشر لسوبر ماركت'
  });

  // إضافة سندات القبض
  console.log('\n📋 إضافة السندات المالية...\n');
  
  await postData('/vouchers', {
    voucherNumber: 'V-2024-001',
    voucherType: 'receipt',
    voucherDate: '2024-09-15',
    amount: 285000,
    entityType: 'customer',
    entityId: customer1?.id,
    entityName: customer1?.name,
    transactionId: '4',
    paymentMethod: 'bank_transfer',
    description: 'تحصيل قيمة بيع 10 رؤوس عجول',
    status: 'completed',
    notes: 'تم التحصيل بالكامل'
  });

  await postData('/vouchers', {
    voucherNumber: 'V-2024-002',
    voucherType: 'payment',
    voucherDate: '2024-02-01',
    amount: 42500,
    entityType: 'supplier',
    entityId: supplier1?.id,
    entityName: supplier1?.name,
    transactionId: '2',
    paymentMethod: 'cash',
    description: 'دفع قيمة علف مركز - 5 طن',
    status: 'completed',
    notes: 'سداد نقدي'
  });

  await postData('/vouchers', {
    voucherNumber: 'V-2024-003',
    voucherType: 'receipt',
    voucherDate: '2024-10-05',
    amount: 435000,
    entityType: 'customer',
    entityId: customer2?.id,
    entityName: customer2?.name,
    transactionId: '5',
    paymentMethod: 'bank_transfer',
    description: 'تحصيل قيمة عقد التوريد الشهري',
    status: 'completed',
    notes: 'تحويل بنكي - تم الاستلام'
  });

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('✅ تم إنشاء جميع البيانات التجريبية بنجاح!');
  console.log('═══════════════════════════════════════════════════════\n');
  
  console.log('📊 ملخص البيانات المضافة:\n');
  console.log('  ✓ 3 موردين');
  console.log('  ✓ 4 عملاء');
  console.log('  ✓ 5 أصناف مخزون');
  console.log('  ✓ 3 دفعات تربية');
  console.log('  ✓ 33 حيوان (15 فريزيان + 10 بلدي + 8 خليط)');
  console.log('  ✓ 5 أهداف أداء');
  console.log('  ✓ 5 سجلات بيطرية');
  console.log('  ✓ 6 معاملات مالية');
  console.log('  ✓ 5 حركات مخزون');
  console.log('  ✓ 4 مصروفات دفعات');
  console.log('  ✓ 3 سجلات مبيعات');
  console.log('  ✓ 3 سندات مالية');
  console.log('\n🌐 السيرفر: http://localhost:5001');
  console.log('📱 يمكنك الآن فتح المتصفح والتحقق من البيانات\n');
}

// تشغيل السكريبت
(async () => {
  try {
    // انتظار تشغيل السيرفر
    console.log('⏳ جاري الاتصال بالسيرفر...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // مسح البيانات القديمة
    await clearAllData();
    
    // إنشاء بيانات جديدة
    await seedData();
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ حدث خطأ:', error.message);
    process.exit(1);
  }
})();
