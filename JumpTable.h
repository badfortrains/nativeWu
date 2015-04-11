//
//  JumpTable.h
//  nativeWu
//
//  Created by Sean Purcell on 4/10/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

@class RCTEventDispatcher;

@interface JumpTable : UITableView <UITableViewDelegate, UITableViewDataSource>

- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher NS_DESIGNATED_INITIALIZER;

-(void)setDataBlob:(NSDictionary*)blob;

@end
